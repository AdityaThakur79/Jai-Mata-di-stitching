import Customer from "../models/customer.js";
import PendingOrder from "../models/pendingOrder.js";
import Order from "../models/order.js";
import ItemMaster from "../models/item.js";
import Employee from "../models/employee.js";
import TailorSlip from "../models/tailorSlip.js";
import bwipjs from "bwip-js";
import { generateItemToken, generateTokenNumber } from "../utils/common/generateItemToken.js";

const isPrivilegedRole = (role = "") => {
  const normalized = String(role || "").toLowerCase();
  return normalized === "superadmin" || normalized === "director";
};

const getActorFromRequest = (req) => {
  const role = req.employee?.role || req.user?.role || "";
  const name = req.employee?.name || req.user?.name || "System User";
  return { role, name };
};

const generateSlipNumber = (tokenNumber, itemCode) =>
  `SLIP-${tokenNumber}-${String(itemCode || "").slice(-6).toUpperCase()}`;

const ITEM_READY_STATES = ["partial_ready", "ready"];
const isItemReady = (status = "") => ITEM_READY_STATES.includes(String(status || "").toLowerCase());

const syncPendingOrderStatusFromItems = async (pendingOrderId) => {
  const order = await PendingOrder.findById(pendingOrderId).select("items status");
  if (!order || !Array.isArray(order.items) || order.items.length === 0) return order;

  const readyCount = order.items.filter((item) => isItemReady(item.itemStatus)).length;
  let nextStatus = "in_progress";
  if (readyCount === 0) nextStatus = "pending";
  else if (readyCount === order.items.length) nextStatus = "ready_for_delivery";

  if (order.status !== nextStatus) {
    order.status = nextStatus;
    await order.save();
  }
  return order;
};

const buildSlipDocsFromOrder = async (orderDoc) => {
  const customerDoc = await Customer.findById(orderDoc.customer).select("name");
  const itemTypeIds = orderDoc.items.map((item) => item.itemType).filter(Boolean);
  const itemTypes = await ItemMaster.find({ _id: { $in: itemTypeIds } }).select("name stitchingCharge");
  const itemTypeMap = new Map(itemTypes.map((item) => [String(item._id), item]));

  return orderDoc.items.map((item) => {
    const itemType = itemTypeMap.get(String(item.itemType));
    const stitchingRate = Number(itemType?.stitchingCharge || 0);
    const quantity = Number(item.quantity || 1);
    const earningAmount = stitchingRate * quantity;
    const barcodeValue = generateSlipNumber(orderDoc.tokenNumber, item.itemCode);

    return {
      slipNumber: barcodeValue,
      barcodeValue,
      pendingOrder: orderDoc._id,
      tokenNumber: orderDoc.tokenNumber,
      customer: orderDoc.customer,
      customerName: customerDoc?.name || "",
      itemCode: item.itemCode,
      itemType: item.itemType,
      style: item.style,
      fabric: item.fabric,
      quantity,
      measurement: item.measurement || {},
      designNumber: item.designNumber || "",
      description: item.description || "",
      notes: orderDoc.notes || "",
      specialInstructions: orderDoc.specialInstructions || "",
      tailoringRate: stitchingRate,
      earningAmount,
      branchId: orderDoc.branchId,
    };
  });
};

const backfillMissingClientOrderSlips = async (branchId) => {
  const query = {
    status: { $nin: ["completed", "cancelled"] },
    ...(branchId ? { branchId } : {}),
  };
  const orders = await Order.find(query).select(
    "_id orderNumber items clientDetails notes specialInstructions branchId status"
  );
  for (const order of orders) {
    const existingCount = await TailorSlip.countDocuments({ order: order._id });
    if (existingCount > 0) continue;
    if (!Array.isArray(order.items) || order.items.length === 0) continue;

    const itemTypeIds = order.items.map((item) => item.itemType).filter(Boolean);
    const itemTypes = await ItemMaster.find({ _id: { $in: itemTypeIds } }).select("name stitchingCharge");
    const itemTypeMap = new Map(itemTypes.map((item) => [String(item._id), item]));

    const slipDocs = order.items.map((item, index) => {
      const itemType = itemTypeMap.get(String(item.itemType));
      const quantity = Number(item.quantity || 1);
      const tailoringRate = Number(itemType?.stitchingCharge || 0);
      const itemCode = `CO-${generateItemToken()}-${index + 1}`;
      const slipNumber = `SLIP-${order.orderNumber}-${String(index + 1).padStart(2, "0")}`;
      return {
        slipNumber,
        barcodeValue: slipNumber,
        order: order._id,
        tokenNumber: order.orderNumber || "",
        customerName: order.clientDetails?.name || "",
        itemCode,
        itemType: item.itemType,
        itemTypeName: itemType?.name || "",
        styleName: item.style?.styleName || "",
        fabric: item.fabric,
        quantity,
        measurement: item.measurement || {},
        designNumber: item.designNumber || "",
        description: item.description || "",
        notes: order.notes || "",
        specialInstructions: order.specialInstructions || item.specialInstructions || "",
        tailoringRate,
        earningAmount: tailoringRate * quantity,
        branchId: order.branchId,
      };
    });

    if (slipDocs.length > 0) {
      await TailorSlip.insertMany(slipDocs, { ordered: true });
    }
  }
};

export const createPendingOrder = async (req, res) => {
  try {
    const {
      orderType,
      customer,
      customerDetails,
      items,
      master,
      salesman,
      branchId,
      expectedDeliveryDate,
      priority,
      notes,
      specialInstructions,
      discountType,
      discountValue,
      taxRate,
      advancePayment,
      paymentMethod,
      paymentStatus,
      paymentNotes,
      shippingDetails,
    } = req.body;

    const finalBranchId = branchId || req.employee?.branchId;

    // Validate required fields
    if (!orderType || !items || !master || !salesman || !finalBranchId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate order type
    const validOrderTypes = ["fabric", "fabric_stitching", "stitching"];
    if (!validOrderTypes.includes(orderType)) {
      return res.status(400).json({ message: "Invalid order type." });
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required." });
    }

    // Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (!item.itemType) {
        return res.status(400).json({ message: `Item ${i + 1}: Item type is required.` });
      }

      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({ message: `Item ${i + 1}: Valid quantity is required.` });
      }

      // Fabric meters are optional for pending orders
    }

    let customerId;

    if (!customer) {
      if (!customerDetails || !customerDetails.mobile || !customerDetails.name) {
        return res.status(400).json({ message: "Customer details are incomplete." });
      }

      const existing = await Customer.findOne({ mobile: customerDetails.mobile });

      if (existing) {
        customerId = existing._id;

        items.forEach((item) => {
          existing.measurements.push({
            itemType: item.itemType,
            values: item.measurement,
          });
        });

        await existing.save();
      } else {
        const newCustomer = new Customer({
          name: customerDetails.name,
          mobile: customerDetails.mobile,
          email: customerDetails.email,
        });

        items.forEach((item) => {
          newCustomer.measurements.push({
            itemType: item.itemType,
            values: item.measurement,
          });
        });

        const savedCustomer = await newCustomer.save();
        customerId = savedCustomer._id;
      }
    } else {
      customerId = customer;

      const existingCustomer = await Customer.findById(customer);
      if (existingCustomer) {
        items.forEach((item) => {
          existingCustomer.measurements.push({
            itemType: item.itemType,
            values: item.measurement,
          });
        });
        await existingCustomer.save();
      }
    }

    const tokenNumber = generateTokenNumber();

    // Process items to ensure proper data types
    const updatedItems = items.map((item) => ({
      ...item,
      itemCode: generateItemToken(),
      quantity: parseInt(item.quantity),
      fabric: item.fabric ? item.fabric : undefined,
      style: item.style ? item.style : undefined,
      fabricMeters: item.fabric && item.fabricMeters ? parseFloat(item.fabricMeters) : undefined,
      alteration: parseFloat(item.alteration) || 0,
      handwork: parseFloat(item.handwork) || 0,
      otherCharges: parseFloat(item.otherCharges) || 0,
      measurement: item.measurement || {},
      itemStatus: "pending",
      itemStatusUpdatedAt: new Date(),
    }));

    const subtotal = updatedItems.reduce((sum, item) => {
      const additional = (item.alteration || 0) + (item.handwork || 0) + (item.otherCharges || 0);
      return sum + additional;
    }, 0);
    const safeDiscountType = discountType === "fixed" ? "fixed" : "percentage";
    const safeDiscountValue = parseFloat(discountValue) || 0;
    const discountAmount =
      safeDiscountType === "percentage" ? (subtotal * safeDiscountValue) / 100 : safeDiscountValue;
    const shippingCost = parseFloat(shippingDetails?.shippingCost) || 0;
    const taxableAmount = subtotal - discountAmount + shippingCost;
    const safeTaxRate = parseFloat(taxRate) || 5;
    const taxAmount = (taxableAmount * safeTaxRate) / 100;
    const totalAmount = taxableAmount + taxAmount;

    const newOrder = new PendingOrder({
      tokenNumber,
      orderType,
      customer: customerId,
      items: updatedItems,
      master,
      salesman,
      branchId: finalBranchId,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined,
      priority: priority || "medium",
      notes: notes || "",
      specialInstructions: specialInstructions || "",
      discountType: safeDiscountType,
      discountValue: safeDiscountValue,
      discountAmount,
      subtotal,
      taxableAmount,
      taxRate: safeTaxRate,
      taxAmount,
      totalAmount,
      advancePayment: parseFloat(advancePayment) || 0,
      paymentMethod: paymentMethod || undefined,
      paymentStatus: paymentStatus || "pending",
      paymentNotes: paymentNotes || "",
      shippingDetails: shippingDetails
        ? {
            shippingAddress: shippingDetails.shippingAddress || "",
            shippingCity: shippingDetails.shippingCity || "",
            shippingState: shippingDetails.shippingState || "",
            shippingPincode: shippingDetails.shippingPincode || "",
            shippingPhone: shippingDetails.shippingPhone || "",
            shippingMethod: shippingDetails.shippingMethod || "home_delivery",
            shippingCost,
            deliveryNotes: shippingDetails.deliveryNotes || "",
            deliveryPerson: shippingDetails.deliveryPerson || "",
            deliveryPersonContact: shippingDetails.deliveryPersonContact || "",
            deliveryStatus: shippingDetails.deliveryStatus || "pending",
            extraField1Label: shippingDetails.extraField1Label || "",
            extraField1Value: shippingDetails.extraField1Value || "",
            extraField2Label: shippingDetails.extraField2Label || "",
            extraField2Value: shippingDetails.extraField2Value || "",
          }
        : {},
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours later
    });

    await newOrder.save();
    const slipDocs = await buildSlipDocsFromOrder(newOrder);
    if (slipDocs.length > 0) {
      await TailorSlip.insertMany(slipDocs, { ordered: true });
    }

    res.status(201).json({
      message: "Pending Order created successfully",
      token: tokenNumber,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error creating pending order:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ message: "Token number already exists. Please try again." });
    }
    
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPendingOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const user = req.employee;
    const query = {};
    // Branch-based filtering
    if (user && !["director", "superAdmin"].includes(user.role)) {
      query.branchId = user.branchId;
    }
    if (search) {
      query.$or = [
        { tokenNumber: { $regex: search, $options: "i" } },
      ];
    }
    const total = await PendingOrder.countDocuments(query);
    const orders = await PendingOrder.find(query)
      .populate("customer", "name mobile email")
      .populate("items.itemType", "name")
      .populate("items.fabric", "name")
      .populate("items.style", "name")
      .populate("master", "name")
      .populate("salesman", "name")
      .populate("invoice", "invoiceNumber status totalAmount")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json({ total, page: Number(page), limit: Number(limit), orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching pending orders." });
  }
};

export const getPendingOrderById = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    // Handle case where orderId might be an object
    const actualOrderId = typeof orderId === 'object' ? orderId.orderId : orderId;

    const order = await PendingOrder.findById(actualOrderId)
      .populate("customer", "name mobile email")
      .populate("items.itemType")
      .populate("items.fabric")  
      .populate("items.style", "name")
      .populate("master", "name")
      .populate("salesman", "name")
      .populate("branchId", "branchName address");

    if (!order) {
      return res.status(404).json({ message: "Pending order not found." });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching pending order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getPendingOrdersWithin24Hours = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get matching customer IDs based on name search
    const matchingCustomerIds = await Customer.find({
      name: { $regex: search, $options: "i" },
    }).distinct("_id");

    // Build the query for orders within last 24h and matching search
    const query = {
      createdAt: { $gte: twentyFourHoursAgo },
      status: "pending",
      $or: [
        { tokenNumber: { $regex: search, $options: "i" } },
        { customer: { $in: matchingCustomerIds } },
      ],
    };

    const total = await PendingOrder.countDocuments(query);

    const orders = await PendingOrder.find(query)
      .populate("customer", "name mobile email")
      .populate("master", "name")
      .populate("salesman", "name")
      .populate("items.itemType", "name")
      .populate("items.fabric", "name price")
      .populate("items.style", "name")
      .populate("invoice", "invoiceNumber status totalAmount")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      orders,
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ message: "Server error while fetching recent orders." });
  }
};

export const updatePendingOrder = async (req, res) => {
  try {
    const {
      orderId,
      orderType,
      customer,
      customerDetails,
      items,
      master,
      salesman,
      branchId,
      expectedDeliveryDate,
      priority,
      notes,
      specialInstructions,
      discountType,
      discountValue,
      taxRate,
      advancePayment,
      paymentMethod,
      paymentStatus,
      paymentNotes,
      shippingDetails,
    } = req.body;

    // Validate required fields
    if (!orderId || !orderType || !items || !master || !salesman) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate order type
    const validOrderTypes = ["fabric", "fabric_stitching", "stitching"];
    if (!validOrderTypes.includes(orderType)) {
      return res.status(400).json({ message: "Invalid order type." });
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required." });
    }

    // Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (!item.itemType) {
        return res.status(400).json({ message: `Item ${i + 1}: Item type is required.` });
      }

      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({ message: `Item ${i + 1}: Valid quantity is required.` });
      }

      // Fabric meters are optional for pending orders
    }

    // Check if order exists
    const existingOrder = await PendingOrder.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ message: "Pending order not found." });
    }
    const finalBranchId = branchId || req.employee?.branchId || existingOrder?.branchId;
    if (!finalBranchId) {
      return res.status(400).json({ message: "Branch is required." });
    }

    let customerId;

    if (!customer) {
      if (!customerDetails || !customerDetails.mobile || !customerDetails.name) {
        return res.status(400).json({ message: "Customer details are incomplete." });
      }

      const existing = await Customer.findOne({ mobile: customerDetails.mobile });

      if (existing) {
        customerId = existing._id;
      } else {
        const newCustomer = new Customer({
          name: customerDetails.name,
          mobile: customerDetails.mobile,
          email: customerDetails.email,
        });

        const savedCustomer = await newCustomer.save();
        customerId = savedCustomer._id;
      }
    } else {
      customerId = customer;
    }

    // Process items to ensure proper data types
    const updatedItems = items.map((item) => ({
      ...item,
      itemCode: item.itemCode || generateItemToken(),
      quantity: parseInt(item.quantity),
      fabric: item.fabric ? item.fabric : undefined,
      style: item.style ? item.style : undefined,
      fabricMeters: item.fabric && item.fabricMeters ? parseFloat(item.fabricMeters) : undefined,
      alteration: parseFloat(item.alteration) || 0,
      handwork: parseFloat(item.handwork) || 0,
      otherCharges: parseFloat(item.otherCharges) || 0,
      measurement: item.measurement || {},
      itemStatus: item.itemStatus || "pending",
      itemStatusUpdatedAt: item.itemStatusUpdatedAt || new Date(),
    }));

    const subtotal = updatedItems.reduce((sum, item) => {
      const additional = (item.alteration || 0) + (item.handwork || 0) + (item.otherCharges || 0);
      return sum + additional;
    }, 0);
    const safeDiscountType = discountType === "fixed" ? "fixed" : "percentage";
    const safeDiscountValue = parseFloat(discountValue) || 0;
    const discountAmount =
      safeDiscountType === "percentage" ? (subtotal * safeDiscountValue) / 100 : safeDiscountValue;
    const shippingCost = parseFloat(shippingDetails?.shippingCost) || 0;
    const taxableAmount = subtotal - discountAmount + shippingCost;
    const safeTaxRate = parseFloat(taxRate) || 5;
    const taxAmount = (taxableAmount * safeTaxRate) / 100;
    const totalAmount = taxableAmount + taxAmount;

    // Update the order
    const updatedOrder = await PendingOrder.findByIdAndUpdate(
      orderId,
      {
        orderType,
        customer: customerId,
        items: updatedItems,
        master,
        salesman,
        branchId: finalBranchId,
        expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined,
        priority: priority || "medium",
        notes: notes || "",
        specialInstructions: specialInstructions || "",
        discountType: safeDiscountType,
        discountValue: safeDiscountValue,
        discountAmount,
        subtotal,
        taxableAmount,
        taxRate: safeTaxRate,
        taxAmount,
        totalAmount,
        advancePayment: parseFloat(advancePayment) || 0,
        paymentMethod: paymentMethod || undefined,
        paymentStatus: paymentStatus || "pending",
        paymentNotes: paymentNotes || "",
        shippingDetails: shippingDetails
          ? {
              shippingAddress: shippingDetails.shippingAddress || "",
              shippingCity: shippingDetails.shippingCity || "",
              shippingState: shippingDetails.shippingState || "",
              shippingPincode: shippingDetails.shippingPincode || "",
              shippingPhone: shippingDetails.shippingPhone || "",
              shippingMethod: shippingDetails.shippingMethod || "home_delivery",
              shippingCost,
              deliveryNotes: shippingDetails.deliveryNotes || "",
              deliveryPerson: shippingDetails.deliveryPerson || "",
              deliveryPersonContact: shippingDetails.deliveryPersonContact || "",
              deliveryStatus: shippingDetails.deliveryStatus || "pending",
              extraField1Label: shippingDetails.extraField1Label || "",
              extraField1Value: shippingDetails.extraField1Value || "",
              extraField2Label: shippingDetails.extraField2Label || "",
              extraField2Value: shippingDetails.extraField2Value || "",
            }
          : {},
      },
      { new: true }
    );

    const incomingItemCodeSet = new Set(updatedItems.map((item) => item.itemCode));
    const existingSlips = await TailorSlip.find({ pendingOrder: orderId });
    const existingSlipMap = new Map(existingSlips.map((slip) => [slip.itemCode, slip]));

    const itemTypeIds = updatedItems.map((item) => item.itemType).filter(Boolean);
    const itemTypes = await ItemMaster.find({ _id: { $in: itemTypeIds } }).select("name stitchingCharge");
    const itemTypeMap = new Map(itemTypes.map((item) => [String(item._id), item]));
    const customerDoc = await Customer.findById(customerId).select("name");

    for (const item of updatedItems) {
      const existingSlip = existingSlipMap.get(item.itemCode);
      const itemType = itemTypeMap.get(String(item.itemType));
      const stitchingRate = Number(itemType?.stitchingCharge || 0);
      const quantity = Number(item.quantity || 1);
      const earningAmount = stitchingRate * quantity;
      const basePayload = {
        tokenNumber: updatedOrder.tokenNumber,
        customer: customerId,
        customerName: customerDoc?.name || "",
        itemType: item.itemType,
        style: item.style,
        fabric: item.fabric,
        quantity,
        measurement: item.measurement || {},
        designNumber: item.designNumber || "",
        description: item.description || "",
        notes: notes || "",
        specialInstructions: specialInstructions || "",
        tailoringRate: stitchingRate,
        earningAmount,
        branchId: finalBranchId,
      };

      if (existingSlip) {
        await TailorSlip.findByIdAndUpdate(existingSlip._id, basePayload);
      } else {
        const barcodeValue = generateSlipNumber(updatedOrder.tokenNumber, item.itemCode);
        await TailorSlip.create({
          ...basePayload,
          slipNumber: barcodeValue,
          barcodeValue,
          pendingOrder: updatedOrder._id,
          itemCode: item.itemCode,
        });
      }
    }

    const removedItemCodes = existingSlips
      .filter((slip) => !incomingItemCodeSet.has(slip.itemCode))
      .map((slip) => slip.itemCode);

    if (removedItemCodes.length > 0) {
      await TailorSlip.updateMany(
        { pendingOrder: updatedOrder._id, itemCode: { $in: removedItemCodes }, scannedAt: { $exists: false } },
        { $set: { status: "cancelled" } }
      );
    }

    res.status(200).json({
      message: "Pending Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating pending order:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ message: "Token number already exists. Please try again." });
    }
    
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePendingOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Invalid or missing order ID" });
    }

    const order = await PendingOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Pending order not found" });
    }

    await TailorSlip.updateMany(
      { pendingOrder: orderId, status: { $ne: "assigned" } },
      { $set: { status: "cancelled" } }
    );
    await PendingOrder.findByIdAndDelete(orderId);

    res.status(200).json({ message: "Pending order deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error while deleting order" });
  }
};

export const updatePendingOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "measurement_taken",
      "cutting",
      "stitching",
      "quality_check",
      "ready_for_delivery",
      "out_for_delivery",
      "delivered",
      "completed",
      "on_hold",
      "billed",
      "expired",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const order = await PendingOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Pending order not found." });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: "Pending order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating pending order status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTailorSlips = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "all", scannedOnly = "false" } = req.query;
    const actor = req.employee || req.user;
    const query = {};

    if (actor && !isPrivilegedRole(actor.role)) {
      query.branchId = actor.branchId;
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (String(scannedOnly).toLowerCase() === "true") {
      query.scannedAt = { $exists: true, $ne: null };
    }
    await backfillMissingClientOrderSlips(query.branchId);
    if (search) {
      query.$or = [
        { slipNumber: { $regex: search, $options: "i" } },
        { tokenNumber: { $regex: search, $options: "i" } },
        { itemCode: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { scannedByName: { $regex: search, $options: "i" } },
      ];
    }

    const total = await TailorSlip.countDocuments(query);
    const slips = await TailorSlip.find(query)
      .populate("customer", "name mobile")
      .populate("itemType", "name")
      .populate("style", "name")
      .populate("scannedBy", "name employeeId role")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      slips,
    });
  } catch (error) {
    console.error("Error fetching slips:", error);
    res.status(500).json({ success: false, message: "Failed to fetch slips" });
  }
};

export const printTailorSlip = async (req, res) => {
  try {
    const { slipId } = req.params;
    const slip = await TailorSlip.findById(slipId)
      .populate("customer", "name mobile")
      .populate("itemType", "name")
      .populate("style", "name");

    if (!slip) {
      return res.status(404).json({ success: false, message: "Slip not found" });
    }

    const { role, name } = getActorFromRequest(req);
    const canReprint = isPrivilegedRole(role);
    const alreadyPrinted = Number(slip.printCount || 0) > 0;
    const isDuplicate = alreadyPrinted;

    if (alreadyPrinted && !canReprint) {
      return res.status(403).json({
        success: false,
        message: "Slip already printed. Only superadmin/director can reprint.",
      });
    }

    const barcodePngBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: slip.barcodeValue,
      scale: 3,
      height: 12,
      includetext: true,
      textxalign: "center",
    });

    slip.printCount = Number(slip.printCount || 0) + 1;
    if (isDuplicate) {
      slip.duplicatePrintCount = Number(slip.duplicatePrintCount || 0) + 1;
    }
    slip.printedAt = new Date();
    slip.printedByRole = role || "";
    slip.printedByName = name || "";
    if (slip.status === "pending") {
      slip.status = "printed";
    }
    await slip.save();

    res.status(200).json({
      success: true,
      message: isDuplicate ? "Duplicate slip generated" : "Slip generated",
      printMeta: {
        isDuplicate,
        printCount: slip.printCount,
      },
      slip,
      barcodeImage: `data:image/png;base64,${barcodePngBuffer.toString("base64")}`,
    });
  } catch (error) {
    console.error("Error printing slip:", error);
    res.status(500).json({ success: false, message: "Failed to print slip" });
  }
};

export const scanTailorSlip = async (req, res) => {
  try {
    const { barcodeValue } = req.body;
    if (!barcodeValue) {
      return res.status(400).json({ success: false, message: "barcodeValue is required" });
    }

    const slip = await TailorSlip.findOne({ barcodeValue }).populate("itemType", "name");
    if (!slip) {
      return res.status(404).json({ success: false, message: "Slip not found" });
    }
    if (slip.scannedAt) {
      return res.status(400).json({ success: false, message: "Slip already scanned and assigned" });
    }

    const tokenEmployeeId = req.employee?.employeeId;
    if (!tokenEmployeeId) {
      return res.status(401).json({ success: false, message: "Employee session required for scanning" });
    }

    let employee = await Employee.findById(tokenEmployeeId).select("name role employeeId branchId");
    if (!employee) {
      employee = await Employee.findOne({ employeeId: tokenEmployeeId }).select("name role employeeId branchId");
    }
    if (!employee) {
      return res.status(400).json({ success: false, message: "Only employee accounts can scan slips" });
    }

    slip.scannedAt = new Date();
    slip.scannedBy = employee._id;
    slip.scannedByName = employee.name;
    if (slip.status !== "cancelled") {
      slip.status = "assigned";
    }
    await slip.save();

    if (slip.pendingOrder && slip.itemCode) {
      await PendingOrder.updateOne(
        { _id: slip.pendingOrder, "items.itemCode": slip.itemCode },
        {
          $set: {
            "items.$.itemStatus": "in_progress",
            "items.$.itemStatusUpdatedAt": new Date(),
          },
        }
      );
      await syncPendingOrderStatusFromItems(slip.pendingOrder);
    }

    res.status(200).json({
      success: true,
      message: "Slip assigned successfully",
      slip,
      assignedTailor: {
        name: employee.name,
        employeeId: employee.employeeId,
        role: employee.role,
      },
    });
  } catch (error) {
    console.error("Error scanning slip:", error);
    res.status(500).json({ success: false, message: "Failed to scan slip" });
  }
};

export const getTailorSlipStats = async (req, res) => {
  try {
    const actor = req.employee || req.user;
    const match = {};
    if (actor && !isPrivilegedRole(actor.role)) {
      match.branchId = actor.branchId;
    }
    const slips = await TailorSlip.find(match).select("status printCount duplicatePrintCount scannedAt");
    const stats = slips.reduce(
      (acc, slip) => {
        acc.total += 1;
        acc.totalPrints += Number(slip.printCount || 0);
        acc.duplicatePrints += Number(slip.duplicatePrintCount || 0);
        if (slip.status === "pending") acc.pending += 1;
        if (slip.status === "printed") acc.printed += 1;
        if (slip.status === "assigned") acc.assigned += 1;
        if (slip.status === "cancelled") acc.cancelled += 1;
        if (slip.scannedAt) acc.scanned += 1;
        return acc;
      },
      {
        total: 0,
        pending: 0,
        printed: 0,
        assigned: 0,
        scanned: 0,
        cancelled: 0,
        totalPrints: 0,
        duplicatePrints: 0,
      }
    );
    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching slip stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch slip stats" });
  }
};

export const updateTailorSlipStatus = async (req, res) => {
  try {
    const { slipId } = req.params;
    const { status } = req.body;
    const validStatuses = ["pending", "printed", "assigned", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid slip status." });
    }

    const slip = await TailorSlip.findById(slipId);
    if (!slip) {
      return res.status(404).json({ success: false, message: "Slip not found." });
    }

    slip.status = status;
    await slip.save();

    if (slip.pendingOrder && slip.itemCode) {
      let mappedItemStatus = "pending";
      if (status === "assigned") mappedItemStatus = "in_progress";
      if (status === "completed") mappedItemStatus = "ready";
      if (status === "cancelled") mappedItemStatus = "pending";

      await PendingOrder.updateOne(
        { _id: slip.pendingOrder, "items.itemCode": slip.itemCode },
        {
          $set: {
            "items.$.itemStatus": mappedItemStatus,
            "items.$.itemStatusUpdatedAt": new Date(),
          },
        }
      );
      await syncPendingOrderStatusFromItems(slip.pendingOrder);
    }

    return res.status(200).json({ success: true, message: "Slip status updated", slip });
  } catch (error) {
    console.error("Error updating slip status:", error);
    return res.status(500).json({ success: false, message: "Failed to update slip status" });
  }
};

export const getSlipWorkDetails = async (req, res) => {
  try {
    const { barcodeValue } = req.body;
    if (!barcodeValue) {
      return res.status(400).json({ success: false, message: "barcodeValue is required" });
    }

    const slip = await TailorSlip.findOne({ barcodeValue })
      .populate("itemType", "name")
      .populate("style", "name");
    if (!slip) {
      return res.status(404).json({ success: false, message: "Slip not found" });
    }
    if (!slip.pendingOrder) {
      return res.status(400).json({ success: false, message: "Slip is not linked to a pending order item" });
    }

    const order = await PendingOrder.findById(slip.pendingOrder)
      .populate("customer", "name mobile")
      .populate("items.itemType", "name")
      .populate("items.fabric", "name")
      .populate("items.style", "name");
    if (!order) {
      return res.status(404).json({ success: false, message: "Pending order not found" });
    }

    const item = order.items.find((row) => row.itemCode === slip.itemCode);
    if (!item) {
      return res.status(404).json({ success: false, message: "Order item not found for scanned slip" });
    }

    return res.status(200).json({
      success: true,
      message: "Slip details fetched",
      slip,
      order,
      item,
      progress: {
        totalItems: order.items.length,
        readyItems: order.items.filter((row) => isItemReady(row.itemStatus)).length,
      },
    });
  } catch (error) {
    console.error("Error fetching slip work details:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch slip work details" });
  }
};

export const updatePendingOrderItemWork = async (req, res) => {
  try {
    const { orderId, itemCode } = req.params;
    const {
      measurement,
      description,
      designNumber,
      fabricMeters,
      quantity,
      alteration,
      handwork,
      otherCharges,
      itemStatus,
    } = req.body;

    const validItemStatuses = ["pending", "in_progress", "partial_ready", "ready"];
    if (itemStatus && !validItemStatuses.includes(itemStatus)) {
      return res.status(400).json({ success: false, message: "Invalid itemStatus." });
    }

    const setUpdates = {};
    if (measurement && typeof measurement === "object") setUpdates["items.$.measurement"] = measurement;
    if (description !== undefined) setUpdates["items.$.description"] = description;
    if (designNumber !== undefined) setUpdates["items.$.designNumber"] = designNumber;
    if (fabricMeters !== undefined) setUpdates["items.$.fabricMeters"] = Number(fabricMeters) || 0;
    if (quantity !== undefined) setUpdates["items.$.quantity"] = Number(quantity) || 1;
    if (alteration !== undefined) setUpdates["items.$.alteration"] = Number(alteration) || 0;
    if (handwork !== undefined) setUpdates["items.$.handwork"] = Number(handwork) || 0;
    if (otherCharges !== undefined) setUpdates["items.$.otherCharges"] = Number(otherCharges) || 0;
    if (itemStatus) {
      setUpdates["items.$.itemStatus"] = itemStatus;
      setUpdates["items.$.itemStatusUpdatedAt"] = new Date();
    }

    if (Object.keys(setUpdates).length === 0) {
      return res.status(400).json({ success: false, message: "No item fields provided for update." });
    }

    const updated = await PendingOrder.findOneAndUpdate(
      { _id: orderId, "items.itemCode": itemCode },
      { $set: setUpdates },
      { new: true }
    )
      .populate("customer", "name mobile")
      .populate("items.itemType", "name")
      .populate("items.fabric", "name")
      .populate("items.style", "name");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Order item not found." });
    }

    const slipUpdate = {};
    if (measurement && typeof measurement === "object") slipUpdate.measurement = measurement;
    if (description !== undefined) slipUpdate.description = description;
    if (designNumber !== undefined) slipUpdate.designNumber = designNumber;
    if (quantity !== undefined) slipUpdate.quantity = Number(quantity) || 1;
    if (Object.keys(slipUpdate).length > 0) {
      await TailorSlip.updateOne({ pendingOrder: orderId, itemCode }, { $set: slipUpdate });
    }

    const syncedOrder = await syncPendingOrderStatusFromItems(orderId);
    const updatedItem = updated.items.find((row) => row.itemCode === itemCode);

    return res.status(200).json({
      success: true,
      message: "Order item updated successfully",
      order: updated,
      item: updatedItem,
      orderStatus: syncedOrder?.status || updated.status,
    });
  } catch (error) {
    console.error("Error updating pending order item:", error);
    return res.status(500).json({ success: false, message: "Failed to update order item" });
  }
};

export const getPendingOrderStockBuckets = async (req, res) => {
  try {
    const actor = req.employee || req.user;
    const match = {};
    if (actor && !isPrivilegedRole(actor.role)) {
      match.branchId = actor.branchId;
    }

    const orders = await PendingOrder.find(match)
      .populate("customer", "name mobile")
      .populate("master", "name")
      .populate("salesman", "name")
      .populate("items.itemType", "name")
      .populate("items.fabric", "name")
      .populate("items.style", "name")
      .sort({ updatedAt: -1 });

    const mapped = orders
      .map((order) => {
        const totalItems = order.items?.length || 0;
        const readyItems = (order.items || []).filter((item) => isItemReady(item.itemStatus)).length;
        const workedItems = (order.items || []).filter(
          (item) => ["in_progress", "partial_ready", "ready"].includes(item.itemStatus)
        ).length;
        const pendingItems = totalItems - readyItems;
        const bucket =
          readyItems === totalItems && totalItems > 0
            ? "full_ready"
            : workedItems > 0
              ? "partial_ready"
              : "pending";
        return {
          _id: order._id,
          tokenNumber: order.tokenNumber,
          status: order.status,
          orderType: order.orderType,
          priority: order.priority,
          customer: order.customer,
          master: order.master ? { name: order.master?.name || "" } : null,
          salesman: order.salesman ? { name: order.salesman?.name || "" } : null,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          expectedDeliveryDate: order.expectedDeliveryDate,
          totalItems,
          readyItems,
          pendingItems,
          bucket,
          items: (order.items || []).map((item) => ({
            itemCode: item.itemCode,
            itemTypeName: item.itemType?.name || "",
            fabricName: item.fabric?.name || "",
            styleName: item.style?.name || "",
            designNumber: item.designNumber || "",
            quantity: item.quantity,
            fabricMeters: item.fabricMeters,
            itemStatus: item.itemStatus || "pending",
            itemStatusUpdatedAt: item.itemStatusUpdatedAt,
          })),
        };
      })
      .filter((row) => row.bucket !== "pending");

    return res.status(200).json({
      success: true,
      fullReady: mapped.filter((row) => row.bucket === "full_ready"),
      partialReady: mapped.filter((row) => row.bucket === "partial_ready"),
    });
  } catch (error) {
    console.error("Error fetching stock buckets:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch stock buckets" });
  }
};
