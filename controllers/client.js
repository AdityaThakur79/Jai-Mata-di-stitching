import Client from "../models/client.js";
import Branch from "../models/branch.js";
import Employee from "../models/employee.js";
import { v2 as cloudinary } from "cloudinary";

// Create new client
export const createClient = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address,
      city,
      state,
      pincode,
      dateOfBirth,
      gender,
      notes,
    } = req.body;

    // Validation
    if (!name || !email || !mobile || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Name, email, mobile, address, city, state, and pincode are required.",
      });
    }

    // Check if client already exists
    const existingClient = await Client.findOne({ email: email.toLowerCase() });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client with this email already exists.",
      });
    }

    // Handle profile image upload
    let profileImage = "";
    let profileImagePublicId = "";
    if (req.files && req.files.profileImage) {
      profileImage = req.files.profileImage[0].path;
      profileImagePublicId = req.files.profileImage[0].filename;
    }

    // Get user info from request (set by auth middleware)
    const user = req.employee || req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Get the actual employee _id if we have employeeId
    let registeredById = user._id;
    if (user.employeeId && !user._id) {
      const employee = await Employee.findOne({ employeeId: user.employeeId });
      if (employee) {
        registeredById = employee._id;
      }
    }

    // Handle branch selection - if user doesn't have branchId, they need to select one
    const { branchId } = req.body;
    if (!user.branchId && !branchId) {
      return res.status(400).json({
        success: false,
        message: "Branch selection is required.",
      });
    }

    const newClient = await Client.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      profileImage,
      profileImagePublicId,
      notes: notes || "",
      branchId: user.branchId || branchId,
      registeredBy: registeredById,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully.",
      client: newClient,
    });
  } catch (err) {
    console.error("Error creating client:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};

// Get all clients with pagination and search
export const getAllClients = async (req, res) => {
  try {
    let { page, limit, search, city, state, isActive } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = {};
    
    // Branch-based filtering
    const user = req.employee || req.user;
    if (user && user.branchId && !["director", "superAdmin"].includes(user.role)) {
      query.branchId = user.branchId;
    }
    
    // Search functionality
    if (search && search !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { clientId: { $regex: search, $options: "i" } },
      ];
    }
    
    // Filter by city
    if (city && city !== "") {
      query.city = { $regex: city, $options: "i" };
    }
    
    // Filter by state
    if (state && state !== "") {
      query.state = { $regex: state, $options: "i" };
    }
    
    // Filter by active status
    if (isActive !== undefined && isActive !== "") {
      query.isActive = isActive === "true";
    }

    const clients = await Client.find(query)
      .populate("branchId", "branchName")
      .populate("registeredBy", "name employeeId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Client.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      clients,
      page,
      limit,
      total,
      currentPageCount: clients.length,
      totalPage: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching clients",
      error: err.message,
    });
  }
};

// Get client by ID
export const getClientById = async (req, res) => {
  try {
    const { clientId } = req.body;

    const client = await Client.findById(clientId)
      .populate("branchId", "branchName address")
      .populate("registeredBy", "name employeeId role");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client fetched successfully",
      client,
    });
  } catch (err) {
    console.error("Error fetching client:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Update client
export const updateClient = async (req, res) => {
  try {
    const {
      clientId,
      name,
      email,
      mobile,
      address,
      city,
      state,
      pincode,
      dateOfBirth,
      gender,
      notes,
      isActive,
      branchId,
    } = req.body;

    const existingClient = await Client.findById(clientId);
    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Check if email is being changed and if new email already exists
    if (email && email.toLowerCase() !== existingClient.email) {
      const emailExists = await Client.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: clientId }
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Client with this email already exists.",
        });
      }
    }

    // Handle profile image update
    if (req.files && req.files.profileImage) {
      // Delete old image if exists
      if (existingClient.profileImagePublicId) {
        await cloudinary.uploader.destroy(existingClient.profileImagePublicId);
      }
      existingClient.profileImage = req.files.profileImage[0].path;
      existingClient.profileImagePublicId = req.files.profileImage[0].filename;
    }

    // Update fields
    if (name) existingClient.name = name.trim();
    if (email) existingClient.email = email.toLowerCase().trim();
    if (mobile) existingClient.mobile = mobile.trim();
    if (address) existingClient.address = address.trim();
    if (city) existingClient.city = city.trim();
    if (state) existingClient.state = state.trim();
    if (pincode) existingClient.pincode = pincode.trim();
    if (dateOfBirth !== undefined) existingClient.dateOfBirth = dateOfBirth || null;
    if (gender) existingClient.gender = gender;
    if (notes !== undefined) existingClient.notes = notes;
    if (isActive !== undefined) existingClient.isActive = isActive;
    if (branchId) {
      existingClient.branchId = branchId;
    }

    await existingClient.save();

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client: existingClient,
    });
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Delete client
export const deleteClient = async (req, res) => {
  try {
    const { clientId } = req.body;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Delete profile image from Cloudinary
    if (client.profileImagePublicId) {
      await cloudinary.uploader.destroy(client.profileImagePublicId);
    }

    await client.deleteOne();

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get client statistics
export const getClientStats = async (req, res) => {
  try {
    const user = req.employee || req.user;
    const query = {};
    
    // Branch-based filtering
    if (user && !["director", "superAdmin"].includes(user.role)) {
      query.branchId = user.branchId;
    }

    const totalClients = await Client.countDocuments(query);
    const activeClients = await Client.countDocuments({ ...query, isActive: true });
    const inactiveClients = await Client.countDocuments({ ...query, isActive: false });
    
    // Recent clients (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentClients = await Client.countDocuments({
      ...query,
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      message: "Client statistics fetched successfully",
      stats: {
        totalClients,
        activeClients,
        inactiveClients,
        recentClients,
      },
    });
  } catch (err) {
    console.error("Error fetching client statistics:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get all branches for dropdown
export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ status: "active" })
      .select("_id branchName address")
      .sort({ branchName: 1 });

    res.status(200).json({
      success: true,
      message: "Branches fetched successfully",
      branches,
    });
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
