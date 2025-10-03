import Order, { Bill } from "../models/order.js";
import Client from "../models/client.js";
import ItemMaster from "../models/item.js";
import Fabric from "../models/fabric.js";
import Style from "../models/style.js";
import Branch from "../models/branch.js";
import Employee from "../models/employee.js";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Removed @react-pdf/renderer import - will be handled on frontend

// Helper function to convert image to base64
const convertImageToBase64 = (imagePath) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const fullPath = path.join(__dirname, '..', 'client', 'public', imagePath);
    
    if (fs.existsSync(fullPath)) {
      const imageBuffer = fs.readFileSync(fullPath);
      const base64String = imageBuffer.toString('base64');
      return `data:image/jpeg;base64,${base64String}`;
    } else {
      console.log(`Logo file not found at: ${fullPath}`);
      return null;
    }
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const user = req.employee || req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Get the actual employee _id if we have employeeId
    let createdById = user._id;
    if (user.employeeId && !user._id) {
      const employee = await Employee.findOne({ employeeId: user.employeeId });
      if (employee) {
        createdById = employee._id;
      }
    }

    const {
      orderType,
      client,
      clientDetails,
      items,
      expectedDeliveryDate,
      priority,
      notes,
      specialInstructions,
      branchId,
      advancePayment,
      paymentMethod,
      paymentNotes,
      shippingDetails,
    } = req.body;

    // Validate required fields
    if (!orderType || !items) {
      return res.status(400).json({
        success: false,
        message: "Order type and items are required.",
      });
    }

    // Handle client information
    let clientId = null;
    let finalClientDetails = {};

    if (client) {
      // Existing client
      clientId = client;
      const existingClient = await Client.findById(client);
      if (!existingClient) {
        return res.status(404).json({
          success: false,
          message: "Client not found.",
        });
      }
      finalClientDetails = {
        name: existingClient.name,
        mobile: existingClient.mobile,
        email: existingClient.email,
        address: existingClient.address,
        city: existingClient.city,
        state: existingClient.state,
        pincode: existingClient.pincode,
        gstin: existingClient.gstin,
        pan: existingClient.pan,
        businessName: existingClient.businessName,
        tradeName: existingClient.tradeName,
        legalName: existingClient.legalName,
        businessType: existingClient.businessType,
        gstStatus: existingClient.gstStatus,
        gstStateCode: existingClient.gstStateCode,
      };
    } else if (clientDetails) {
      // New client details
      if (!clientDetails.name || !clientDetails.mobile) {
        return res.status(400).json({
          success: false,
          message: "Client name and mobile are required for new clients.",
        });
      }
      finalClientDetails = clientDetails;
    } else {
      return res.status(400).json({
        success: false,
        message: "Either select existing client or provide client details.",
      });
    }

    // Calculate pricing
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const itemMaster = await ItemMaster.findById(item.itemType);
      if (!itemMaster) {
        return res.status(404).json({
          success: false,
          message: `Item type not found: ${item.itemType}`,
        });
      }

      let itemPrice = 0;
      
      // Calculate fabric cost if fabric is selected
      if (item.fabric && item.fabricMeters) {
        const fabric = await Fabric.findById(item.fabric);
        if (fabric) {
          itemPrice += fabric.pricePerMeter * item.fabricMeters;
        }
      }

      // Add stitching charge if applicable
      if (orderType === "stitching" || orderType === "fabric_stitching") {
        itemPrice += itemMaster.stitchingCharge || 0;
      }

      const totalItemPrice = itemPrice * item.quantity;
      subtotal += totalItemPrice;

      // Find the selected style from the item's styles
      let selectedStyle = null;
      if (item.style) {
        selectedStyle = itemMaster.styles.find(s => s.styleId === item.style);
      }

      processedItems.push({
        ...item,
        style: selectedStyle ? {
          styleId: selectedStyle.styleId,
          styleName: selectedStyle.styleName,
          description: selectedStyle.description
        } : null,
        unitPrice: itemPrice,
        totalPrice: totalItemPrice,
      });
    }

    // Extract discount and tax information from request
    const discountType = req.body.discountType || "percentage";
    const discountValue = parseFloat(req.body.discountValue) || 0;
    const taxRate = parseFloat(req.body.taxRate) || 18; // Default 18% GST
    
    // Calculate discount amount
    let discountAmount = 0;
    if (discountValue > 0) {
      if (discountType === "percentage") {
        discountAmount = (subtotal * discountValue) / 100;
      } else {
        discountAmount = discountValue;
      }
    }
    
    // Calculate taxable amount (after discount)
    const taxableAmount = subtotal - discountAmount;
    
    // Calculate tax amount
    const taxAmount = (taxableAmount * taxRate) / 100;
    
    // Calculate total amount
    const totalAmount = taxableAmount + taxAmount;

    // Create order
    const orderData = {
      orderType,
      client: clientId,
      clientDetails: finalClientDetails,
      items: processedItems,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : null,
      priority: priority || "medium",
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      taxableAmount,
      taxRate,
      taxAmount,
      totalAmount,
      advancePayment: advancePayment ? parseFloat(advancePayment) : 0,
      paymentMethod: paymentMethod || "",
      paymentNotes: paymentNotes || "",
      notes,
      specialInstructions,
      branchId: branchId || user.branchId,
      createdBy: createdById,
      shippingDetails: shippingDetails ? {
        shippingAddress: shippingDetails.shippingAddress || "",
        shippingCity: shippingDetails.shippingCity || "",
        shippingState: shippingDetails.shippingState || "",
        shippingPincode: shippingDetails.shippingPincode || "",
        shippingPhone: shippingDetails.shippingPhone || "",
        shippingMethod: shippingDetails.shippingMethod || "home_delivery",
        shippingCost: shippingDetails.shippingCost ? parseFloat(shippingDetails.shippingCost) : 0,
        trackingNumber: shippingDetails.trackingNumber || "",
        estimatedDeliveryDate: shippingDetails.estimatedDeliveryDate ? new Date(shippingDetails.estimatedDeliveryDate) : null,
        actualDeliveryDate: shippingDetails.actualDeliveryDate ? new Date(shippingDetails.actualDeliveryDate) : null,
        deliveryNotes: shippingDetails.deliveryNotes || "",
        deliveryPerson: shippingDetails.deliveryPerson || "",
        deliveryStatus: shippingDetails.deliveryStatus || "pending",
      } : {},
    };
    
    const order = await Order.create(orderData);

    // Populate the order with references
    const populatedOrder = await Order.findById(order._id)
      .populate("client", "name mobile email")
      .populate("items.itemType", "name stitchingCharge")
      .populate("items.fabric", "name pricePerMeter")
      .populate("branchId", "branchName address")
      .populate("createdBy", "name employeeId");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get all orders with filtering
export const getAllOrders = async (req, res) => {
  try {
    const { page, limit, status, orderType, priority, search } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const user = req.employee || req.user;
    const query = {};

    // Branch-based filtering
    if (user && user.branchId && !["director", "superAdmin"].includes(user.role)) {
      query.branchId = user.branchId;
    }

    // Status filtering
    if (status && status !== "") {
      query.status = status;
    }

    // Order type filtering
    if (orderType && orderType !== "") {
      query.orderType = orderType;
    }

    // Priority filtering
    if (priority && priority !== "") {
      query.priority = priority;
    }

    // Search functionality
    if (search && search !== "") {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "clientDetails.name": { $regex: search, $options: "i" } },
        { "clientDetails.mobile": { $regex: search, $options: "i" } },
        { "clientDetails.email": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .populate("client", "name mobile email")
      .populate("items.itemType", "name")
      .populate("branchId", "branchName")
      .populate("createdBy", "name employeeId")
      .populate("bill", "billNumber billDate dueDate totalAmount paymentStatus")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
      page: pageNum,
      limit: limitNum,
      total,
      currentPageCount: orders.length,
      totalPage: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId)
      .populate("client", "name mobile email address city state pincode")
      .populate("items.itemType", "name stitchingCharge fields")
      .populate("items.fabric", "name pricePerMeter")
      .populate("branchId", "branchName address phone email")
      .populate("createdBy", "name employeeId")
      .populate("bill", "billNumber billDate dueDate subtotal taxAmount totalAmount paymentStatus notes");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};


// Generate bill for order
export const generateBill = async (req, res) => {
  try {
    const { orderId, dueDate, notes } = req.body;

    const order = await Order.findById(orderId)
      .populate("client", "name mobile email address city state pincode")
      .populate("items.itemType", "name stitchingCharge")
      .populate("items.fabric", "name pricePerMeter")
      .populate("branchId", "branchName address phone email gst pan")
      .populate("createdBy", "name employeeId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Bill already generated for this order",
      });
    }

    // Generate bill number
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    
    const lastBill = await Bill.findOne(
      { billNumber: new RegExp(`^JMD-BILL-${currentYear}${currentMonth}-\\d{4}$`) },
      {},
      { sort: { billNumber: -1 } }
    );

    let nextIdNum = 1;
    if (lastBill && lastBill.billNumber) {
      const lastIdNum = parseInt(lastBill.billNumber.split("-")[2]);
      nextIdNum = lastIdNum + 1;
    }
    
    let billNumber = `JMD-BILL-${currentYear}${currentMonth}-${String(nextIdNum).padStart(4, "0")}`;
    
    // Check if bill number already exists and generate a new one if needed
    let existingBill = await Bill.findOne({ billNumber });
    while (existingBill) {
      nextIdNum++;
      billNumber = `JMD-BILL-${currentYear}${currentMonth}-${String(nextIdNum).padStart(4, "0")}`;
      existingBill = await Bill.findOne({ billNumber });
    }

    // Create bill document
    const bill = await Bill.create({
      billNumber,
      billDate: new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      subtotal: order.subtotal,
      discountType: order.discountType,
      discountValue: order.discountValue,
      discountAmount: order.discountAmount,
      taxableAmount: order.taxableAmount,
      taxRate: order.taxRate,
      taxAmount: order.taxAmount,
      totalAmount: order.totalAmount,
      paymentStatus: "pending",
      notes: notes || "",
    });

    // Update order with bill reference and mark as completed
    order.bill = bill._id;
    order.status = "completed";
    order.actualDeliveryDate = new Date();

    await order.save();

    // Populate the order with bill information
    const populatedOrder = await Order.findById(order._id)
      .populate("client", "name mobile email address city state pincode")
      .populate("items.itemType", "name stitchingCharge")
      .populate("items.fabric", "name pricePerMeter")
      .populate("branchId", "branchName address phone email gst pan")
      .populate("createdBy", "name employeeId")
      .populate("bill", "billNumber billDate dueDate subtotal taxAmount totalAmount paymentStatus notes");

    res.status(200).json({
      success: true,
      message: "Bill generated successfully",
      order: populatedOrder,
    });
  } catch (err) {
    console.error("Error generating bill:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(orderId);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const user = req.employee || req.user;
    const query = {};

    // Branch-based filtering
    if (user && user.branchId && !["director", "superAdmin"].includes(user.role)) {
      query.branchId = user.branchId;
    }

    const totalOrders = await Order.countDocuments(query);
    const pendingOrders = await Order.countDocuments({ ...query, status: "pending" });
    const inProgressOrders = await Order.countDocuments({ ...query, status: "in_progress" });
    const completedOrders = await Order.countDocuments({ ...query, status: "completed" });
    const cancelledOrders = await Order.countDocuments({ ...query, status: "cancelled" });

    // Calculate total revenue from completed orders
    const revenueResult = await Order.aggregate([
      { $match: { ...query, status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      message: "Order statistics fetched successfully",
      stats: {
        totalOrders,
        pendingOrders,
        inProgressOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
      },
    });
  } catch (err) {
    console.error("Error fetching order statistics:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, priority, notes } = req.body;

    const validStatuses = [
      "pending", "confirmed", "in_progress", "measurement_taken", 
      "cutting", "stitching", "quality_check", "ready_for_delivery", 
      "out_for_delivery", "delivered", "completed", "cancelled", "on_hold"
    ];

    const validPriorities = ["low", "medium", "high", "urgent"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status provided",
      });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority provided",
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    
    if (notes) {
      const existingOrder = await Order.findById(orderId);
      const timestamp = new Date().toLocaleString();
      const changeType = status ? 'Status' : priority ? 'Priority' : 'Update';
      const changeValue = status || priority;
      updateData.notes = `${existingOrder?.notes || ''}\n[${timestamp}] ${changeType} changed to ${changeValue}: ${notes}`.trim();
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate("client", "name mobile email")
     .populate("items.itemType", "name stitchingCharge")
     .populate("items.fabric", "name pricePerMeter")
     .populate("branchId", "branchName address")
     .populate("createdBy", "name employeeId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Update order
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const {
      clientId,
      orderType,
      priority,
      expectedDeliveryDate,
      notes,
      specialInstructions,
      items,
      discountType,
      discountValue,
      taxRate,
      advancePayment,
      paymentMethod,
      paymentNotes,
      shippingDetails,
    } = req.body;

    // Debug logging
    console.log("UpdateOrder - Received data:");
    console.log("clientId:", clientId);
    console.log("items:", items);
    console.log("items type:", typeof items);
    console.log("items length:", items?.length);
    console.log("items is array:", Array.isArray(items));

    // Validation
    if (!clientId || !items || items.length === 0) {
      console.log("Validation failed - clientId:", clientId, "items:", items);
      return res.status(400).json({
        success: false,
        message: "Client ID and items are required",
      });
    }

    // Check if client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(400).json({
        success: false,
        message: "Client not found",
      });
    }

    // Calculate pricing
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const selectedItem = await ItemMaster.findById(item.itemType);
      if (!selectedItem) {
        return res.status(400).json({
          success: false,
          message: `Item with ID ${item.itemType} not found`,
        });
      }

      let itemPrice = 0;
      let fabricCost = 0;
      let stitchingCost = 0;

      // Calculate fabric cost
      if (item.fabric && item.fabricMeters) {
        const selectedFabric = await Fabric.findById(item.fabric);
        if (selectedFabric) {
          fabricCost = selectedFabric.pricePerMeter * item.fabricMeters;
        }
      }

      // Calculate stitching cost
      stitchingCost = selectedItem.stitchingCharge || 0;
      itemPrice = fabricCost + stitchingCost;
      const totalItemPrice = itemPrice * parseInt(item.quantity);
      subtotal += totalItemPrice;

      processedItems.push({
        itemType: item.itemType,
        quantity: parseInt(item.quantity),
        fabric: item.fabric || null,
        fabricMeters: item.fabricMeters || 0,
        style: {
          styleId: item.style?.styleId || "",
          styleName: item.style?.styleName || "",
          description: item.style?.description || "",
        },
        specialInstructions: item.specialInstructions || "",
        unitPrice: itemPrice,
        totalPrice: totalItemPrice,
      });
    }

    const discountAmount = discountType === "percentage" 
      ? (subtotal * discountValue) / 100 
      : discountValue;

    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const totalAmount = taxableAmount + taxAmount;

    const updateData = {
      client: clientId,
      orderType,
      priority,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : null,
      notes: notes || "",
      specialInstructions: specialInstructions || "",
      items: processedItems,
      subtotal,
      discountType,
      discountValue: parseFloat(discountValue),
      discountAmount,
      taxableAmount,
      taxRate: parseFloat(taxRate),
      taxAmount,
      totalAmount,
      advancePayment: advancePayment ? parseFloat(advancePayment) : 0,
      paymentMethod: paymentMethod || "",
      paymentNotes: paymentNotes || "",
      shippingDetails: shippingDetails ? {
        shippingAddress: shippingDetails.shippingAddress || "",
        shippingCity: shippingDetails.shippingCity || "",
        shippingState: shippingDetails.shippingState || "",
        shippingPincode: shippingDetails.shippingPincode || "",
        shippingPhone: shippingDetails.shippingPhone || "",
        shippingMethod: shippingDetails.shippingMethod || "home_delivery",
        shippingCost: shippingDetails.shippingCost ? parseFloat(shippingDetails.shippingCost) : 0,
        trackingNumber: shippingDetails.trackingNumber || "",
        estimatedDeliveryDate: shippingDetails.estimatedDeliveryDate ? new Date(shippingDetails.estimatedDeliveryDate) : null,
        actualDeliveryDate: shippingDetails.actualDeliveryDate ? new Date(shippingDetails.actualDeliveryDate) : null,
        deliveryNotes: shippingDetails.deliveryNotes || "",
        deliveryPerson: shippingDetails.deliveryPerson || "",
        deliveryStatus: shippingDetails.deliveryStatus || "pending",
      } : {},
    };

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate("client", "name mobile email address city state pincode")
     .populate("items.itemType", "name stitchingCharge")
     .populate("items.fabric", "name pricePerMeter")
     .populate("branchId", "branchName address")
     .populate("createdBy", "name employeeId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { 
      paymentStatus, 
      paymentAmount, 
      paymentMethod, 
      paymentNotes 
    } = req.body;

    const validPaymentStatuses = ["pending", "partial", "paid", "overdue", "refunded"];
    const validPaymentMethods = ["cash", "card", "upi", "bank_transfer", "cheque", "other"];

    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status provided",
      });
    }

    if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method provided",
      });
    }

    const updateData = {
      paymentStatus,
      ...(paymentAmount !== undefined && { paymentAmount: parseFloat(paymentAmount) }),
      ...(paymentMethod && { paymentMethod }),
      ...(paymentNotes && { paymentNotes }),
      ...(paymentStatus === "paid" && { paymentDate: new Date() })
    };

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate("client", "name mobile email")
     .populate("items.itemType", "name stitchingCharge")
     .populate("items.fabric", "name pricePerMeter")
     .populate("branchId", "branchName address")
     .populate("createdBy", "name employeeId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order,
    });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Update bill payment status
export const updateBillPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, paymentAmount, paymentMethod, paymentNotes } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order has a bill
    if (!order.bill) {
      return res.status(400).json({
        success: false,
        message: "No bill found for this order",
      });
    }

    // Update the order's payment information
    const updateData = {
      paymentStatus: paymentStatus || order.paymentStatus,
      paymentAmount: paymentAmount ? parseFloat(paymentAmount) : order.paymentAmount,
      paymentMethod: paymentMethod || order.paymentMethod,
      paymentNotes: paymentNotes || order.paymentNotes,
    };

    if (paymentStatus === "paid") {
      updateData.paymentDate = new Date();
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate("bill", "billNumber billDate dueDate subtotal taxAmount totalAmount paymentStatus notes");

    // Also update the bill's payment status if it exists
    if (updatedOrder.bill && paymentStatus) {
      const Bill = (await import("../models/order.js")).Bill;
      await Bill.findByIdAndUpdate(
        updatedOrder.bill._id,
        { 
          paymentStatus: paymentStatus,
          paymentDate: paymentStatus === "paid" ? new Date() : updatedOrder.bill.paymentDate
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get completed orders statistics
export const getCompletedOrdersStats = async (req, res) => {
  try {
    const user = req.employee || req.user;
    const query = { status: "completed" };

    // Branch-based filtering
    if (user && user.branchId && !["director", "superAdmin"].includes(user.role)) {
      query.branchId = user.branchId;
    }

    // Basic counts
    const totalCompletedOrders = await Order.countDocuments(query);
    
    // Payment status breakdown
    const paymentStats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Convert to object for easier access
    const paymentBreakdown = {
      pending: { count: 0, amount: 0 },
      paid: { count: 0, amount: 0 },
      partial: { count: 0, amount: 0 },
      overdue: { count: 0, amount: 0 }
    };

    paymentStats.forEach(stat => {
      if (paymentBreakdown[stat._id]) {
        paymentBreakdown[stat._id] = {
          count: stat.count,
          amount: stat.totalAmount
        };
      }
    });

    // Order type breakdown
    const orderTypeStats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$orderType",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Priority breakdown
    const priorityStats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Revenue calculations
    const totalRevenue = paymentBreakdown.paid.amount + paymentBreakdown.partial.amount;
    const pendingAmount = paymentBreakdown.pending.amount;
    const overdueAmount = paymentBreakdown.overdue.amount;
    const totalOrderValue = Object.values(paymentBreakdown).reduce((sum, stat) => sum + stat.amount, 0);

    // Recent completed orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCompleted = await Order.countDocuments({
      ...query,
      updatedAt: { $gte: thirtyDaysAgo }
    });

    // Average order value
    const avgOrderValue = totalCompletedOrders > 0 ? totalOrderValue / totalCompletedOrders : 0;

    // Payment collection rate
    const collectionRate = totalOrderValue > 0 ? (totalRevenue / totalOrderValue) * 100 : 0;

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          ...query, 
          updatedAt: { $gte: sixMonthsAgo },
          paymentStatus: { $in: ["paid", "partial"] }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" }
          },
          revenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      success: true,
      message: "Completed orders statistics fetched successfully",
      stats: {
        overview: {
          totalCompletedOrders,
          recentCompleted,
          totalOrderValue,
          totalRevenue,
          pendingAmount,
          overdueAmount,
          avgOrderValue,
          collectionRate: Math.round(collectionRate * 100) / 100
        },
        paymentBreakdown,
        orderTypeStats,
        priorityStats,
        monthlyRevenue
      }
    });
  } catch (err) {
    console.error("Error fetching completed orders statistics:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get comprehensive statistics for all orders
export const getAllOrdersStats = async (req, res) => {
  try {
    const user = req.employee || req.user;
    const query = {};

    // Branch-based filtering
    if (user && user.branchId && !["director", "superAdmin"].includes(user.role)) {
      query.branchId = user.branchId;
    }

    // Total orders count
    const totalOrders = await Order.countDocuments(query);

    // Status breakdown
    const statusBreakdown = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Convert status breakdown to object format
    const statusStats = {
      pending: { count: 0, amount: 0 },
      confirmed: { count: 0, amount: 0 },
      in_progress: { count: 0, amount: 0 },
      measurement_taken: { count: 0, amount: 0 },
      cutting: { count: 0, amount: 0 },
      stitching: { count: 0, amount: 0 },
      quality_check: { count: 0, amount: 0 },
      ready_for_delivery: { count: 0, amount: 0 },
      out_for_delivery: { count: 0, amount: 0 },
      delivered: { count: 0, amount: 0 },
      completed: { count: 0, amount: 0 },
      cancelled: { count: 0, amount: 0 },
      on_hold: { count: 0, amount: 0 }
    };

    statusBreakdown.forEach(stat => {
      const status = stat._id || "pending";
      if (statusStats[status]) {
        statusStats[status] = {
          count: stat.count,
          amount: stat.totalAmount
        };
      }
    });

    // Priority breakdown
    const priorityBreakdown = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Convert priority breakdown to object format
    const priorityStats = {
      low: { count: 0, amount: 0 },
      medium: { count: 0, amount: 0 },
      high: { count: 0, amount: 0 },
      urgent: { count: 0, amount: 0 }
    };

    priorityBreakdown.forEach(stat => {
      const priority = stat._id || "low";
      if (priorityStats[priority]) {
        priorityStats[priority] = {
          count: stat.count,
          amount: stat.totalAmount
        };
      }
    });

    // Order type breakdown
    const orderTypeBreakdown = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$orderType",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Payment status breakdown (for orders with bills)
    const paymentBreakdown = await Order.aggregate([
      { $match: { ...query, bill: { $exists: true } } },
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Convert payment breakdown to object format
    const paymentStats = {
      pending: { count: 0, amount: 0 },
      paid: { count: 0, amount: 0 },
      partial: { count: 0, amount: 0 },
      overdue: { count: 0, amount: 0 }
    };

    paymentBreakdown.forEach(stat => {
      const status = stat._id || "pending";
      if (paymentStats[status]) {
        paymentStats[status] = {
          count: stat.count,
          amount: stat.totalAmount
        };
      }
    });

    // Revenue calculations
    const totalRevenue = paymentStats.paid.amount + paymentStats.partial.amount;
    const pendingAmount = paymentStats.pending.amount;
    const overdueAmount = paymentStats.overdue.amount;
    const totalOrderValue = Object.values(statusStats).reduce((sum, stat) => sum + stat.amount, 0);

    // Recent orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = await Order.countDocuments({
      ...query,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalOrderValue / totalOrders : 0;

    // Orders with bills vs without bills
    const ordersWithBills = await Order.countDocuments({ ...query, bill: { $exists: true } });
    const ordersWithoutBills = totalOrders - ordersWithBills;

    // Bill generation rate
    const billGenerationRate = totalOrders > 0 ? (ordersWithBills / totalOrders) * 100 : 0;

    // Monthly order trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyOrders = await Order.aggregate([
      { 
        $match: { 
          ...query, 
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          orderCount: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Active orders (not completed or cancelled)
    const activeOrders = await Order.countDocuments({
      ...query,
      status: { $nin: ["completed", "cancelled"] }
    });

    // Completion rate
    const completionRate = totalOrders > 0 ? (statusStats.completed.count / totalOrders) * 100 : 0;

    res.status(200).json({
      success: true,
      message: "All orders statistics fetched successfully",
      stats: {
        overview: {
          totalOrders,
          activeOrders,
          recentOrders,
          totalOrderValue,
          totalRevenue,
          pendingAmount,
          overdueAmount,
          avgOrderValue,
          completionRate: Math.round(completionRate * 100) / 100,
          billGenerationRate: Math.round(billGenerationRate * 100) / 100,
          ordersWithBills,
          ordersWithoutBills
        },
        statusBreakdown: statusStats,
        priorityBreakdown: priorityStats,
        orderTypeBreakdown,
        paymentBreakdown: paymentStats,
        monthlyOrders
      }
    });
  } catch (err) {
    console.error("Error fetching all orders statistics:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get order data for invoice generation (frontend will handle PDF generation)
export const getOrderForInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("client", "name mobile email address city state pincode")
      .populate("items.itemType", "name stitchingCharge")
      .populate("items.fabric", "name pricePerMeter")
      .populate("branchId", "branchName address phone email gst pan bankDetails")
      .populate("createdBy", "name employeeId")
      .populate("bill", "billNumber billDate dueDate subtotal taxAmount totalAmount paymentStatus notes");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.bill) {
      return res.status(400).json({
        success: false,
        message: "No bill found for this order",
      });
    }

    
    // Convert logo to base64
    const logoBase64 = convertImageToBase64("images/jmd_logo.jpeg");

    // Create invoice data
    const invoiceData = {
      companyName: "JMD STITCHING PRIVATE LIMITED",
      companyAddress: order.branchId?.address || "Company Address",
      companyPhone: order.branchId?.phone || "9082150556",
      companyEmail: order.branchId?.email || "info@jmdstithing.com",
      companyGST: order.branchId?.gst || "GST123456789",
      companyPAN: order.branchId?.pan || "PAN123456789",
      logo: logoBase64,
      // Payment Information from branch profile
      bankName: order.branchId?.bankDetails?.bankName || "Union Bank of India",
      accountName: "JMD STITCHING PRIVATE LIMITED",
      accountNumber: order.branchId?.bankDetails?.accountNumber || "11111111111",
      ifscCode: order.branchId?.bankDetails?.ifsc || "BCCB3578435",
      upiId: `${order.branchId?.phone || "9082150556"}@okbizaxis`,
      invoiceNumber: order.bill.billNumber,
      invoiceDate: new Date(order.bill.billDate).toLocaleDateString('en-IN'),
      dueDate: new Date(order.bill.dueDate).toLocaleDateString('en-IN'),
      clientName: order.client?.name || order.clientDetails?.name,
      clientAddress: order.client?.address || order.clientDetails?.address,
      clientCity: order.client?.city || order.clientDetails?.city,
      clientState: order.client?.state || order.clientDetails?.state,
      clientPincode: order.client?.pincode || order.clientDetails?.pincode,
      clientMobile: order.client?.mobile || order.clientDetails?.mobile,
      clientEmail: order.client?.email || order.clientDetails?.email,
      items: order.items.map(item => ({
        name: item.itemType?.name || "Item",
        description: item.style?.styleName || "",
        quantity: item.quantity,
        unitPrice: item.unitPrice || 0,
        totalPrice: item.totalPrice || 0,
        fabric: item.fabric?.name || "",
        fabricMeters: item.fabricMeters || 0,
        stitchingCharge: item.itemType?.stitchingCharge || 0
      })),
      subtotal: order.bill.subtotal || 0,
      discountType: order.discountType || "percentage",
      discountValue: order.discountValue || 0,
      discountAmount: order.discountAmount || order.bill.discountAmount || 0,
      taxableAmount: order.taxableAmount || order.bill.taxableAmount || 0,
      taxRate: order.taxRate || 18,
      taxAmount: order.taxAmount || order.bill.taxAmount || 0,
      totalAmount: order.bill.totalAmount || 0,
      advancePayment: order.advancePayment || 0,
      balanceAmount: (order.bill.totalAmount || 0) - (order.advancePayment || 0),
      paymentStatus: order.paymentStatus || "pending",
      paymentMethod: order.paymentMethod || "",
      paymentNotes: order.paymentNotes || "",
      notes: order.bill.notes || "",
      shippingDetails: order.shippingDetails || null
    };

    console.log("Order discount details:", {
      orderDiscountType: order.discountType,
      orderDiscountValue: order.discountValue,
      orderDiscountAmount: order.discountAmount,
      billDiscountAmount: order.bill.discountAmount,
      subtotal: order.bill.subtotal,
      totalAmount: order.bill.totalAmount
    });
    
    console.log("Branch details:", {
      branchId: order.branchId?._id,
      branchName: order.branchId?.branchName,
      bankDetails: order.branchId?.bankDetails,
      bankName: order.branchId?.bankDetails?.bankName,
      accountNumber: order.branchId?.bankDetails?.accountNumber,
      ifsc: order.branchId?.bankDetails?.ifsc,
      finalBankName: invoiceData.bankName,
      finalAccountNumber: invoiceData.accountNumber,
      finalIfscCode: invoiceData.ifscCode
    });
    
    console.log("Sending invoice data:", JSON.stringify(invoiceData, null, 2));
    
    res.status(200).json({
      success: true,
      message: "Order data fetched successfully",
      invoiceData,
    });

  } catch (err) {
    console.error("Error fetching order for invoice:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
