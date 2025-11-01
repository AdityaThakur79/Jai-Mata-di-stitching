import Order, { Bill } from "../models/order.js";
import Client from "../models/client.js";
import ItemMaster from "../models/item.js";
import Fabric from "../models/fabric.js";
import Branch from "../models/branch.js";
import pdfService from "./pdfService.js";
import { sendInvoiceEmail, sendOrderConfirmationEmail } from "../utils/common/sendMail.js";
import { sendInvoiceWhatsapp, sendOrderConfirmationWhatsapp } from "../utils/common/sendWhatsapp.js";
import { getLogoBase64 } from "../utils/imageUtils.js";

class OrderService {
  constructor() {
    // Populate options removed - using explicit populate calls instead
  }

  /**
   * Get order with all necessary population
   */
  async getOrderById(orderId) {
    console.log("Getting order with ID:", orderId);
    return await Order.findById(orderId)
      .populate("client", "name mobile email address city state pincode gstin pan")
      .populate("items.itemType", "name stitchingCharge")
      .populate("items.fabric", "name pricePerMeter")
      .populate("branchId", "branchName address phone email gst pan cin bankDetails qrCodeImage")
      .populate("createdBy", "name employeeId")
      .populate("bill", "billNumber billDate dueDate subtotal taxAmount totalAmount paidAmount pendingAmount paymentStatus notes pdfUrl pdfPublicId");
  }

  /**
   * Generate unique bill number
   */
  async generateBillNumber() {
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    
    const lastBill = await Bill.findOne(
      { billNumber: new RegExp(`^JMD-BILL-${currentYear}${currentMonth}-\\d{4}$`) },
      {},
      { sort: { billNumber: -1 } }
    );

    let nextIdNum = 1;
    if (lastBill && lastBill.billNumber) {
      const lastIdNum = parseInt(lastBill.billNumber.split("-")[3]);
      nextIdNum = lastIdNum + 1;
    }
    
    let billNumber = `JMD-BILL-${currentYear}${currentMonth}-${String(nextIdNum).padStart(4, "0")}`;
    
    // Ensure uniqueness
    let existingBill = await Bill.findOne({ billNumber });
    while (existingBill) {
      nextIdNum++;
      billNumber = `JMD-BILL-${currentYear}${currentMonth}-${String(nextIdNum).padStart(4, "0")}`;
      existingBill = await Bill.findOne({ billNumber });
    }

    return billNumber;
  }

  /**
   * Create bill document
   */
  async createBill(order, billNumber, dueDate, notes) {
    const advancePayment = order.advancePayment || 0;
    const totalAmount = order.totalAmount || 0;
    const paidAmount = Math.min(advancePayment, totalAmount); // Cannot exceed total
    const pendingAmount = Math.max(0, totalAmount - advancePayment); // Cannot be negative
    
    // Determine payment status based on advance payment
    let paymentStatus = "pending";
    if (advancePayment >= totalAmount) {
      paymentStatus = "paid";
    } else if (advancePayment > 0) {
      paymentStatus = "pending"; // Still pending since advance is partial
    }
    
    return await Bill.create({
      billNumber,
      billDate: new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal: order.subtotal,
      discountType: order.discountType,
      discountValue: order.discountValue,
      discountAmount: order.discountAmount,
      taxableAmount: order.taxableAmount,
      taxRate: order.taxRate,
      taxAmount: order.taxAmount,
      totalAmount: totalAmount,
      paidAmount: paidAmount,
      pendingAmount: pendingAmount,
      paymentStatus: paymentStatus,
      notes: notes || "",
    });
  }

  /**
   * Update order with bill reference
   */
  async updateOrderWithBill(order, bill) {
    order.bill = bill._id;
    if (order.status !== "completed") {
      order.status = "completed";
    }
    if (!order.actualDeliveryDate) {
      order.actualDeliveryDate = new Date();
    }
    return await order.save();
  }

  /**
   * Prepare invoice data for PDF generation
   */
  prepareInvoiceData(order, bill) {
    return {
      companyName: "JMD STITCHING PRIVATE LIMITED",
      companyAddress: order.branchId?.address || "",
      companyPhone: order.branchId?.phone || "",
      companyEmail: order.branchId?.email || "",
      companyGST: order.branchId?.gst || "",
      companyPAN: order.branchId?.pan || "",
      companyCIN: order.branchId?.cin || "",
      logo: getLogoBase64(),
      bankName: order.branchId?.bankDetails?.bankName || "Union Bank of India",
      accountName: "JMD STITCHING PRIVATE LIMITED",
      accountNumber: order.branchId?.bankDetails?.accountNumber || "11111111111",
      ifscCode: order.branchId?.bankDetails?.ifsc || "BCCB3578435",
      upiId: `${order.branchId?.phone || "9082150556"}@okbizaxis`,
      invoiceNumber: bill.billNumber,
      invoiceDate: new Date(bill.billDate).toLocaleDateString('en-IN'),
      dueDate: new Date(bill.dueDate).toLocaleDateString('en-IN'),
      orderType: order.orderType || "",
      clientName: order.client?.name || order.clientDetails?.name || "Client Name",
      clientAddress: order.client?.address || order.clientDetails?.address || "Client Address",
      clientCity: order.client?.city || order.clientDetails?.city || "City",
      clientState: order.client?.state || order.clientDetails?.state || "State",
      clientPincode: order.client?.pincode || order.clientDetails?.pincode || "000000",
      clientMobile: order.client?.mobile || order.clientDetails?.mobile || "0000000000",
      clientEmail: order.client?.email || order.clientDetails?.email || "",
      gstin: order.client?.gstin || order.clientDetails?.gstin || "",
      items: order.items.map(item => ({
        name: item.itemType?.name || 'Item',
        description: item.style?.styleName || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        totalPrice: item.totalPrice || 0,
        fabric: item.fabric?.name || '',
        fabricMeters: item.fabricMeters || 0,
        clientOrderNumber: item.clientOrderNumber || order.clientOrderNumber || "",
        alteration: item.alteration || 0,
        handwork: item.handwork || 0,
        otherCharges: item.otherCharges || 0
      })),
      subtotal: bill.subtotal || 0,
      discountType: bill.discountType || "percentage",
      discountValue: bill.discountValue || 0,
      discountAmount: bill.discountAmount || 0,
      taxableAmount: bill.taxableAmount || 0,
      taxRate: bill.taxRate || 18,
      taxAmount: bill.taxAmount || 0,
      totalAmount: bill.totalAmount || 0,
      advancePayment: order.advancePayment || 0,
      paidAmount: bill.paidAmount || order.advancePayment || 0,
      pendingAmount: bill.pendingAmount || Math.max(0, (bill.totalAmount || 0) - (order.advancePayment || 0)),
      balanceAmount: (bill.totalAmount || 0) - (order.advancePayment || 0),
      paymentStatus: order.paymentStatus || bill.paymentStatus || 'pending',
      paymentMethod: order.paymentMethod || '',
      paymentNotes: order.paymentNotes || '',
      notes: bill.notes || '',
      shippingDetails: order.shippingDetails || null,
      qrCodeImage: (() => {
        const qr = order.branchId?.qrCodeImage || order.branch?.qrCodeImage || "";
        console.log('[InvoiceData] Resolved qrCodeImage for invoice:', qr ? 'Found' : 'Not found', qr ? '(path exists)' : '');
        return qr;
      })(),
      branchQrCodeImage: (() => {
        const qr = order.branchId?.qrCodeImage || order.branch?.qrCodeImage || "";
        console.log('[InvoiceData] Resolved branchQrCodeImage for invoice:', qr ? 'Found' : 'Not found');
        return qr;
      })(),
    };
  }

  /**
   * Send notifications (email and WhatsApp)
   */
  async sendNotifications(invoiceData, bill, order) {
    const notifications = [];

    // Order confirmation email notification (WITH PDF ATTACHMENT)
    if (invoiceData.clientEmail) {
      notifications.push(
        sendOrderConfirmationEmail({
          clientName: invoiceData.clientName,
          clientEmail: invoiceData.clientEmail,
          billNumber: bill.billNumber,
          orderType: order.orderType,
          totalAmount: bill.totalAmount,
          paymentStatus: order.paymentStatus || 'Pending',
          pdfBuffer: invoiceData.pdfBuffer, // Pass PDF buffer directly
          isAdminCopy: false
        }).catch(e => console.warn('Order confirmation email send failed:', e?.message))
      );
    }

    // Order confirmation WhatsApp notification
    if (invoiceData.clientMobile) {
      notifications.push(
        sendOrderConfirmationWhatsapp({
          phone: invoiceData.clientMobile,
          clientName: invoiceData.clientName,
          billNumber: bill.billNumber,
          orderType: order.orderType,
          totalAmount: bill.totalAmount,
          paymentStatus: order.paymentStatus || 'Pending'
        }).catch(e => console.warn('Order confirmation WhatsApp send failed:', e?.message))
      );
    }

    // Invoice email notification (with PDF attachment)
    if (invoiceData.clientEmail) {
      notifications.push(
        sendInvoiceEmail({
          to: invoiceData.clientEmail,
          subject: `Invoice ${bill.billNumber}`,
          htmlText: `Dear ${invoiceData.clientName}, your invoice ${bill.billNumber} total ₹${invoiceData.totalAmount} is ready. Download: ${bill.pdfUrl}`,
          attachments: [
            { filename: `Invoice-${bill.billNumber}.pdf`, content: invoiceData.pdfBuffer, contentType: 'application/pdf' }
          ]
        }).catch(e => console.warn('Invoice email send failed:', e?.message))
      );
    }

    // Invoice WhatsApp notification (with PDF)
    if (invoiceData.clientMobile) {
      notifications.push(
        sendInvoiceWhatsapp({
          phone: invoiceData.clientMobile,
          pdfUrl: bill.pdfUrl,
          orderNumber: order.orderNumber,
          totalAmount: bill.totalAmount
        }).catch(e => console.warn('Invoice WhatsApp send failed:', e?.message))
      );
    }

    // Wait for all notifications to complete (fire-and-forget)
    await Promise.allSettled(notifications);
  }

  /**
   * Generate bill with PDF and notifications
   */
  async generateBill(orderId, dueDate, notes) {
    try {
      // Get order with all necessary data
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      // Check if bill already exists
      if (order.bill) {
        throw new Error("Bill already generated for this order");
      }

      // Generate bill number and create bill
      const billNumber = await this.generateBillNumber();
      const bill = await this.createBill(order, billNumber, dueDate, notes);

      // Update order with bill reference
      await this.updateOrderWithBill(order, bill);

      // Prepare invoice data
      const invoiceData = this.prepareInvoiceData(order, bill);

      // Generate and upload PDF
      const pdfResult = await pdfService.generateAndUploadPDF(invoiceData, billNumber);
      
      // Update bill and order with PDF URLs
      bill.pdfUrl = pdfResult.pdfUrl; // Image URL for delivery (free plan compatible)
      bill.pdfOriginalUrl = pdfResult.original_url; // Original PDF URL
      bill.pdfPublicId = pdfResult.pdfPublicId;
      bill.pdfDeliveryFormat = pdfResult.delivery_format || 'image';
      await bill.save();

      order.pdfUrl = pdfResult.pdfUrl; // Image URL for delivery
      order.pdfOriginalUrl = pdfResult.original_url; // Original PDF URL
      order.pdfPublicId = pdfResult.pdfPublicId;
      order.pdfDeliveryFormat = pdfResult.delivery_format || 'image';
      await order.save();

      // Add PDF buffer to invoice data for notifications
      invoiceData.pdfBuffer = pdfResult.pdfBuffer;

      // Send notifications
      await this.sendNotifications(invoiceData, bill, order);

      // Return populated order
      const populatedOrder = await this.getOrderById(order._id);

      return {
        success: true,
        order: populatedOrder,
        bill,
        pdfUrl: pdfResult.pdfUrl, // Image URL for delivery (free plan compatible)
        pdfOriginalUrl: pdfResult.original_url, // Original PDF URL
        pdfDeliveryFormat: pdfResult.delivery_format || 'image',
        pdfSize: pdfResult.size
      };

    } catch (error) {
      console.error("Error generating bill:", error);
      throw error;
    }
  }

  /**
   * Get order data for invoice generation
   */
  async getOrderForInvoice(orderId) {
    try {
      const order = await this.getOrderById(orderId);
      
      if (!order) {
        throw new Error("Order not found");
      }

      if (!order.bill) {
        throw new Error("No bill found for this order");
      }

      const invoiceData = this.prepareInvoiceData(order, order.bill);
      
      // Add PDF URLs
      invoiceData.pdfUrl = order.bill.pdfUrl || order.pdfUrl;
      invoiceData.pdfPublicId = order.bill.pdfPublicId || order.pdfPublicId;

      return {
        success: true,
        invoiceData
      };

    } catch (error) {
      console.error("Error getting order for invoice:", error);
      throw error;
    }
  }

  /**
   * Update order with validation
   */
  async updateOrder(orderId, updateData) {
    try {
      // Validate required fields
      if (!updateData.clientId) {
        throw new Error("Client ID is required");
      }

      if (!updateData.items || updateData.items.length === 0) {
        throw new Error("At least one item is required");
      }

      // Process items
      const processedItems = updateData.items.map(item => ({
        itemType: item.itemType,
        quantity: parseInt(item.quantity),
        fabric: item.fabric || null,
        fabricMeters: item.fabricMeters || 0,
        style: {
          styleId: item.style?.styleId || "",
          styleName: item.style?.styleName || "",
          description: item.style?.description || ""
        },
        specialInstructions: item.specialInstructions || ""
      }));

      // Calculate totals
      const subtotal = processedItems.reduce((sum, item) => {
        const itemMaster = updateData.itemMasters?.find(im => im._id === item.itemType);
        const fabric = updateData.fabrics?.find(f => f._id === item.fabric);
        
        let itemPrice = (itemMaster?.stitchingCharge || 0) * item.quantity;
        if (fabric && item.fabricMeters > 0) {
          itemPrice += fabric.pricePerMeter * item.fabricMeters;
        }
        
        return sum + itemPrice;
      }, 0);

      const discountAmount = updateData.discountType === "percentage" 
        ? (subtotal * updateData.discountValue) / 100 
        : updateData.discountValue;

      const taxableAmount = subtotal - discountAmount;
      const taxAmount = (taxableAmount * updateData.taxRate) / 100;
      const totalAmount = taxableAmount + taxAmount;

      // Prepare update data
      const finalUpdateData = {
        client: updateData.clientId,
        orderType: updateData.orderType,
        priority: updateData.priority,
        expectedDeliveryDate: updateData.expectedDeliveryDate ? new Date(updateData.expectedDeliveryDate) : null,
        notes: updateData.notes || "",
        specialInstructions: updateData.specialInstructions || "",
        items: processedItems,
        subtotal,
        discountType: updateData.discountType,
        discountValue: parseFloat(updateData.discountValue),
        discountAmount,
        taxableAmount,
        taxRate: parseFloat(updateData.taxRate),
        taxAmount,
        totalAmount,
        advancePayment: updateData.advancePayment ? parseFloat(updateData.advancePayment) : 0,
        paymentMethod: updateData.paymentMethod || undefined,
        paymentNotes: updateData.paymentNotes || "",
        shippingDetails: updateData.shippingDetails ? {
          shippingAddress: updateData.shippingDetails.shippingAddress || "",
          shippingCity: updateData.shippingDetails.shippingCity || "",
          shippingState: updateData.shippingDetails.shippingState || "",
          shippingPincode: updateData.shippingDetails.shippingPincode || "",
          shippingPhone: updateData.shippingDetails.shippingPhone || "",
          shippingMethod: updateData.shippingDetails.shippingMethod || "home_delivery",
          shippingCost: updateData.shippingDetails.shippingCost ? parseFloat(updateData.shippingDetails.shippingCost) : 0,
          trackingNumber: updateData.shippingDetails.trackingNumber || "",
          estimatedDeliveryDate: updateData.shippingDetails.estimatedDeliveryDate ? new Date(updateData.shippingDetails.estimatedDeliveryDate) : null,
          actualDeliveryDate: updateData.shippingDetails.actualDeliveryDate ? new Date(updateData.shippingDetails.actualDeliveryDate) : null,
          deliveryNotes: updateData.shippingDetails.deliveryNotes || "",
          deliveryPerson: updateData.shippingDetails.deliveryPerson || "",
          deliveryStatus: updateData.shippingDetails.deliveryStatus || "pending",
        } : {},
      };

      // Update order
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        finalUpdateData,
        { new: true }
      )
      .populate("client", "name mobile email address city state pincode gstin pan")
      .populate("items.itemType", "name stitchingCharge")
      .populate("items.fabric", "name pricePerMeter")
      .populate("branchId", "branchName address phone email gst pan cin bankDetails")
      .populate("createdBy", "name employeeId")
      .populate("bill", "billNumber billDate dueDate subtotal taxAmount totalAmount paidAmount pendingAmount paymentStatus notes pdfUrl pdfPublicId");

      if (!updatedOrder) {
        throw new Error("Order not found");
      }

      return {
        success: true,
        order: updatedOrder
      };

    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  }
}

export default new OrderService();
