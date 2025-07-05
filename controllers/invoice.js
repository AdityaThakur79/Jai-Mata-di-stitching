import Invoice from "../models/Invoice.js";
import PendingOrder from "../models/PendingOrder.js";
import Customer from "../models/customer.js";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

// Create invoice from pending order
export const createInvoice = async (req, res) => {
  try {
    const {
      pendingOrderId,
      gstPercentage = 18,
      discountPercentage = 0,
      dueDate,
      remarks,
      termsAndConditions,
    } = req.body;

    // Validate required fields
    if (!pendingOrderId || !dueDate) {
      return res.status(400).json({ message: "Pending order ID and due date are required." });
    }

    // Check if pending order exists and is not already billed
    const pendingOrder = await PendingOrder.findById(pendingOrderId)
      .populate("customer")
      .populate("items.itemType")
      .populate("items.fabric")
      .populate("items.style");

    if (!pendingOrder) {
      return res.status(404).json({ message: "Pending order not found." });
    }

    if (pendingOrder.status === "billed") {
      return res.status(400).json({ message: "Order is already billed." });
    }

    // Check if invoice already exists for this pending order
    const existingInvoice = await Invoice.findOne({ pendingOrder: pendingOrderId });
    if (existingInvoice) {
      return res.status(400).json({ message: "Invoice already exists for this order." });
    }

    // Generate invoice number
    const invoiceNumber = await Invoice.generateInvoiceNumber();

    // Prepare invoice items with calculated amounts
    const invoiceItems = pendingOrder.items.map(item => {
      const fabricRate = item.fabric?.pricePerMeter || 0;
      const stitchingRate = item.itemType?.stitchingCharge || 0;
      const fabricAmount = (item.fabricMeters || 0) * fabricRate;
      const stitchingAmount = item.quantity * stitchingRate;
      const totalAmount = fabricAmount + stitchingAmount;

      return {
        itemCode: item.itemCode,
        itemType: item.itemType._id,
        fabric: item.fabric?._id,
        fabricMeters: item.fabricMeters || 0,
        fabricRate: fabricRate,
        fabricAmount: fabricAmount,
        style: item.style?._id,
        quantity: item.quantity,
        stitchingRate: stitchingRate,
        stitchingAmount: stitchingAmount,
        measurement: item.measurement || {},
        designNumber: item.designNumber || "",
        description: item.description || "",
        totalAmount: totalAmount,
      };
    });

    // Calculate subtotal
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.totalAmount, 0);
    
    // Calculate GST and discount amounts
    const gstAmount = (subtotal * gstPercentage) / 100;
    const discountAmount = (subtotal * discountPercentage) / 100;
    const totalAmount = subtotal + gstAmount - discountAmount;

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber,
      pendingOrder: pendingOrderId,
      customer: pendingOrder.customer._id,
      billDate: new Date(),
      dueDate: new Date(dueDate),
      subtotal,
      gstPercentage,
      gstAmount,
      discountPercentage,
      discountAmount,
      totalAmount,
      remarks,
      termsAndConditions,
      biller: req.user.userId,
      items: invoiceItems,
      status: "draft",
    });

    await invoice.save();

    // Update pending order status
    pendingOrder.status = "billed";
    pendingOrder.invoice = invoice._id;
    await pendingOrder.save();

    // Populate references for response
    await invoice.populate([
      { path: "pendingOrder", select: "tokenNumber orderType" },
      { path: "customer", select: "name mobile email" },
      { path: "biller", select: "name" },
      { path: "items.itemType", select: "name stitchingCharge" },
      { path: "items.fabric", select: "name pricePerMeter" },
      { path: "items.style", select: "name" },
    ]);

    res.status(201).json({
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId)
      .populate("pendingOrder", "tokenNumber orderType")
      .populate("customer", "name mobile email address")
      .populate("biller", "name")
      .populate("items.itemType", "name stitchingCharge")
      .populate("items.fabric", "name pricePerMeter")
      .populate("items.style", "name");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    res.status(200).json({ invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all invoices with pagination and search
export const getAllInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;

    console.log('Invoice query params:', { page, limit, search, status });

    const query = {};
    
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    console.log('MongoDB query:', JSON.stringify(query, null, 2));

    const total = await Invoice.countDocuments(query);
    console.log('Total invoices found:', total);

    const invoices = await Invoice.find(query)
      .populate("customer", "name mobile")
      .populate("pendingOrder", "tokenNumber")
      .populate("biller", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    console.log('Invoices fetched:', invoices.length);

    // Debug: Log first invoice if exists
    if (invoices.length > 0) {
      console.log('First invoice sample:', {
        id: invoices[0]._id,
        invoiceNumber: invoices[0].invoiceNumber,
        customer: invoices[0].customer,
        status: invoices[0].status
      });
    }

    const response = {
      total,
      page: Number(page),
      limit: Number(limit),
      invoices,
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update invoice
export const updateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const updateData = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    // Don't allow updates if invoice is already paid
    if (invoice.status === "paid") {
      return res.status(400).json({ message: "Cannot update paid invoice." });
    }

    // Update invoice
    Object.assign(invoice, updateData);
    await invoice.save();

    // Populate references for response
    await invoice.populate([
      { path: "pendingOrder", select: "tokenNumber orderType" },
      { path: "customer", select: "name mobile email" },
      { path: "biller", select: "name" },
      { path: "items.itemType", select: "name stitchingCharge" },
      { path: "items.fabric", select: "name pricePerMeter" },
      { path: "items.style", select: "name" },
    ]);

    res.status(200).json({
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Generate PDF invoice
export const generateInvoicePDF = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    console.log('Generating PDF for invoice:', invoiceId);

    const invoice = await Invoice.findById(invoiceId)
      .populate("pendingOrder", "tokenNumber orderType")
      .populate("customer", "name mobile email address")
      .populate("biller", "name")
      .populate("items.itemType", "name stitchingCharge")
      .populate("items.fabric", "name pricePerMeter")
      .populate("items.style", "name");

    if (!invoice) {
      console.log('Invoice not found:', invoiceId);
      return res.status(404).json({ message: "Invoice not found." });
    }

    console.log('Invoice found, generating HTML...');
    // Generate HTML content for PDF
    const htmlContent = generateInvoiceHTML(invoice);

    // Launch puppeteer with macOS compatible settings
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    console.log('Launching browser...');
    const page = await browser.newPage();
    console.log('Setting content...');
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    console.log('Generating PDF...');
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    console.log('PDF generated, size:', pdfBuffer.length);
    await browser.close();

    // Save PDF to file system (optional)
    const pdfFileName = `invoice-${invoice.invoiceNumber}.pdf`;
    const pdfPath = path.join(process.cwd(), 'uploads', 'invoices', pdfFileName);
    
    console.log('Saving PDF to:', pdfPath);
    // Ensure directory exists
    const dir = path.dirname(pdfPath);
    if (!fs.existsSync(dir)) {
      console.log('Creating directory:', dir);
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      fs.writeFileSync(pdfPath, pdfBuffer);
      console.log('PDF saved successfully to:', pdfPath);
      
      // Verify file exists and has content
      if (fs.existsSync(pdfPath)) {
        const stats = fs.statSync(pdfPath);
        console.log('PDF file size:', stats.size, 'bytes');
        if (stats.size === 0) {
          console.error('Warning: PDF file is empty!');
        }
      } else {
        console.error('Warning: PDF file was not created!');
      }
    } catch (fileError) {
      console.error('Error saving PDF file:', fileError);
      // Continue even if file save fails
    }

    // Update invoice with PDF details
    try {
      invoice.pdfUrl = `/uploads/invoices/${pdfFileName}`;
      invoice.pdfGeneratedAt = new Date();
      invoice.status = "generated";
      await invoice.save();
      console.log('Invoice updated with PDF details');
    } catch (updateError) {
      console.error('Error updating invoice:', updateError);
      // Continue even if update fails
    }

    // Send PDF as response
    console.log('Sending PDF response...');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${pdfFileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error generating PDF:", error);
    
    // More detailed error logging
    if (error.message) {
      console.error("Error message:", error.message);
    }
    if (error.stack) {
      console.error("Error stack:", error.stack);
    }
    
    res.status(500).json({ 
      message: "Error generating PDF",
      error: error.message 
    });
  }
};

// Helper function to generate HTML for PDF
const generateInvoiceHTML = (invoice) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .customer-info, .invoice-info {
          flex: 1;
        }
        .invoice-info {
          text-align: right;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .totals {
          text-align: right;
          margin-top: 20px;
        }
        .total-row {
          font-weight: bold;
          font-size: 16px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">JMD Stitching</div>
        <div>Professional Tailoring Services</div>
        <div>Contact: +91 1234567890 | Email: info@jmdstitching.com</div>
      </div>

      <div class="invoice-details">
        <div class="customer-info">
          <h3>Bill To:</h3>
          <p><strong>${invoice.customer.name}</strong></p>
          <p>Mobile: ${invoice.customer.mobile}</p>
          <p>Email: ${invoice.customer.email || 'N/A'}</p>
          ${invoice.customer.address ? `<p>Address: ${invoice.customer.address}</p>` : ''}
        </div>
        <div class="invoice-info">
          <h3>Invoice Details:</h3>
          <p><strong>Invoice No:</strong> ${invoice.invoiceNumber}</p>
          <p><strong>Order No:</strong> ${invoice.pendingOrder.tokenNumber}</p>
          <p><strong>Bill Date:</strong> ${new Date(invoice.billDate).toLocaleDateString()}</p>
          <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Fabric</th>
            <th>Style</th>
            <th>Qty</th>
            <th>Fabric (m)</th>
            <th>Fabric Rate</th>
            <th>Fabric Amt</th>
            <th>Stitching Rate</th>
            <th>Stitching Amt</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
            <tr>
              <td>${item.itemType.name}</td>
              <td>${item.fabric ? item.fabric.name : 'N/A'}</td>
              <td>${item.style ? item.style.name : 'N/A'}</td>
              <td>${item.quantity}</td>
              <td>${item.fabricMeters || 0}</td>
              <td>₹${item.fabricRate}</td>
              <td>₹${item.fabricAmount}</td>
              <td>₹${item.stitchingRate}</td>
              <td>₹${item.stitchingAmount}</td>
              <td>₹${item.totalAmount}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <p>Subtotal: ₹${invoice.subtotal}</p>
        <p>GST (${invoice.gstPercentage}%): ₹${invoice.gstAmount}</p>
        <p>Discount (${invoice.discountPercentage}%): -₹${invoice.discountAmount}</p>
        <p class="total-row">Total Amount: ₹${invoice.totalAmount}</p>
        <p>Paid Amount: ₹${invoice.paidAmount}</p>
        <p class="total-row">Balance Due: ₹${invoice.balanceAmount}</p>
      </div>

      ${invoice.remarks ? `
        <div class="footer">
          <h4>Remarks:</h4>
          <p>${invoice.remarks}</p>
        </div>
      ` : ''}

      ${invoice.termsAndConditions ? `
        <div class="footer">
          <h4>Terms & Conditions:</h4>
          <p>${invoice.termsAndConditions}</p>
        </div>
      ` : ''}

      <div class="footer">
        <p><strong>Billed by:</strong> ${invoice.biller.name}</p>
        <p><strong>Thank you for your business!</strong></p>
      </div>
    </body>
    </html>
  `;
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { paidAmount, paymentStatus } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    invoice.paidAmount = paidAmount || invoice.paidAmount;
    invoice.paymentStatus = paymentStatus || invoice.paymentStatus;
    
    await invoice.save();

    res.status(200).json({
      message: "Payment status updated successfully",
      invoice,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete invoice (soft delete)
export const deleteInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    // Only allow deletion of draft invoices
    if (invoice.status !== "draft") {
      return res.status(400).json({ message: "Only draft invoices can be deleted." });
    }

    // Update pending order status back to pending
    await PendingOrder.findByIdAndUpdate(invoice.pendingOrder, {
      status: "pending",
      invoice: null,
    });

    await Invoice.findByIdAndDelete(invoiceId);

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 