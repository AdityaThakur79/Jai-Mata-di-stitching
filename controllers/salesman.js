import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// Create Salesman
export const createSalesman = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let photoUrl = "";
    let photoUrlPublicId = "";

    if (req.files?.profilePhoto) {
      photoUrl = req.files.profilePhoto[0].path;
      photoUrlPublicId = req.files.profilePhoto[0].filename;
    }

    const salesman = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "salesman",
      photoUrl,
      photoUrlPublicId,
      status: true,
    });

    return res.status(201).json({
      success: true,
      message: "Salesman created successfully",
      salesman,
    });
  } catch (err) {
    console.error("Create Salesman Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get All Salesmen
export const getAllSalesmen = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {
      role: "salesman",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const total = await User.countDocuments(query);
    const salesmen = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages,
      salesmen,
    });
  } catch (err) {
    console.error("Fetch Salesmen Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Salesman by ID
export const getSalesmanById = async (req, res) => {
  try {
    const { salesmanId } = req.body;
    const salesman = await User.findById(salesmanId).select("-password");

    if (!salesman || salesman.role !== "salesman") {
      return res.status(404).json({
        success: false,
        message: "Salesman not found",
      });
    }

    return res.status(200).json({ success: true, salesman });
  } catch (err) {
    console.error("Get Salesman Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Salesman
export const updateSalesman = async (req, res) => {
  try {
    const { salesmanId, name, email, status } = req.body;

    const salesman = await User.findById(salesmanId);

    if (!salesman || salesman.role !== "salesman") {
      return res.status(404).json({
        success: false,
        message: "Salesman not found",
      });
    }

    if (req.files?.profilePhoto) {
      if (salesman.photoUrlPublicId) {
        await cloudinary.uploader.destroy(salesman.photoUrlPublicId);
      }
      salesman.photoUrl = req.files.profilePhoto[0].path;
      salesman.photoUrlPublicId = req.files.profilePhoto[0].filename;
    }

    if (name) salesman.name = name;
    if (email) salesman.email = email;
    if (status !== undefined) salesman.status = status;

    await salesman.save();

    return res.status(200).json({
      success: true,
      message: "Salesman updated successfully",
      salesman,
    });
  } catch (err) {
    console.error("Update Salesman Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Salesman
export const deleteSalesman = async (req, res) => {
  try {
    const { salesmanId } = req.body;
    const salesman = await User.findById(salesmanId);

    if (!salesman || salesman.role !== "salesman") {
      return res.status(404).json({
        success: false,
        message: "Salesman not found",
      });
    }

    if (salesman.photoUrlPublicId) {
      await cloudinary.uploader.destroy(salesman.photoUrlPublicId);
    }

    await salesman.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Salesman deleted successfully",
    });
  } catch (err) {
    console.error("Delete Salesman Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
