import Customer from "../models/customer.js";
import PendingOrder from "../models/pendingOrder.js";
import { generateItemToken, generateTokenNumber } from "../utils/common/generateItemToken.js";

export const createPendingOrder = async (req, res) => {
  try {
    const {
      orderType,
      customer,
      customerDetails,
      items,
      master,
      salesman,
    } = req.body;

    // Validate required fields
    if (!orderType || !items || !master || !salesman) {
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

      // Validate fabric fields
      if (item.fabric) {
        if (!item.fabricMeters || item.fabricMeters < 2) {
          return res.status(400).json({ 
            message: `Item ${i + 1}: Fabric meters must be at least 2 when fabric is selected.` 
          });
        }
      }
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
      fabricMeters: item.fabric && item.fabricMeters ? parseFloat(item.fabricMeters) : undefined,
      measurement: item.measurement || {},
    }));

    const newOrder = new PendingOrder({
      tokenNumber,
      orderType,
      customer: customerId,
      items: updatedItems,
      master,
      salesman,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours later
    });

    await newOrder.save();

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
      .populate("salesman", "name");

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

      // Validate fabric fields
      if (item.fabric) {
        if (!item.fabricMeters || item.fabricMeters < 2) {
          return res.status(400).json({ 
            message: `Item ${i + 1}: Fabric meters must be at least 2 when fabric is selected.` 
          });
        }
      }
    }

    // Check if order exists
    const existingOrder = await PendingOrder.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ message: "Pending order not found." });
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
      fabricMeters: item.fabric && item.fabricMeters ? parseFloat(item.fabricMeters) : undefined,
      measurement: item.measurement || {},
    }));

    // Update the order
    const updatedOrder = await PendingOrder.findByIdAndUpdate(
      orderId,
      {
        orderType,
        customer: customerId,
        items: updatedItems,
        master,
        salesman,
      },
      { new: true }
    );

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

    await PendingOrder.findByIdAndDelete(orderId);

    res.status(200).json({ message: "Pending order deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error while deleting order" });
  }
};
