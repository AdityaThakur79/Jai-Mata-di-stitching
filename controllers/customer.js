import Customer from "../models/customer.js";

//Create Customer
export const createCustomer = async (req, res) => {
  try {
    const { name, mobile, email, measurements } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Name and mobile number are required.",
      });
    }

    const existing = await Customer.findOne({ mobile });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Customer with this mobile number already exists.",
      });
    }

    let profileImage = "";
    let profileImagePublicId = "";
    if (req.files && req.files.customerProfilePhoto) {
      profileImage = req.files.customerProfilePhoto[0].path;
      profileImagePublicId = req.files.customerProfilePhoto[0].filename;
    }

    const customer = await Customer.create({
      name,
      mobile,
      email,
      profileImage,
      profileImagePublicId,
      measurements: measurements ? JSON.parse(measurements) : [],  
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

//Get all customer
export const getAllCustomers = async (req, res) => {
  try {
    let { page, limit, search } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Customer.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      customers,
      page,
      limit,
      total,
      currentPageCount: customers.length,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching customers",
    });
  }
};

//get customer by Id
export const getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer fetched successfully",
      customer,
    });
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

//Update Customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email } = req.body;

    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    let profileImage = existingCustomer.profileImage;
    let profileImagePublicId = existingCustomer.profileImagePublicId;

    if (req.files && req.files.customerProfilePhoto) {
      profileImage = req.files.customerProfilePhoto[0].path;
      profileImagePublicId = req.files.customerProfilePhoto[0].filename;
    }

    existingCustomer.name = name || existingCustomer.name;
    existingCustomer.mobile = mobile || existingCustomer.mobile;
    existingCustomer.email = email || existingCustomer.email;
    existingCustomer.profileImage = profileImage;
    existingCustomer.profileImagePublicId = profileImagePublicId;

    await existingCustomer.save();

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: existingCustomer,
    });
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

//delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const addMeasurementToCustomer = async (req, res) => {
  try {
    const { id } = req.body;
    const {
      itemType,
      designNumber,
      values,
      style,
      master,
      salesman,
      imageUrl
    } = req.body;

    if (!itemType || !values || !master || !salesman) {
      return res.status(400).json({
        success: false,
        message: "Missing required measurement details",
      });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    customer.measurements.push({
      itemType,
      designNumber,
      values,
      style,
      master,
      salesman,
      imageUrl,
      date: new Date(),
    });

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Measurement added successfully",
      customer,
    });
  } catch (err) {
    console.error("Error adding measurement:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
