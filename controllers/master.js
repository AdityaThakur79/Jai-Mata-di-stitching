import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const createMaster = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
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

        const master = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "master",
            photoUrl,
            photoUrlPublicId,
            status: true,
        });

        return res.status(201).json({
            success: true,
            message: "Master created successfully",
            master,
        });
    } catch (err) {
        console.error("Create Master Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAllMasters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {
      role: "master",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const total = await User.countDocuments(query);
    const masters = await User.find(query)
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
      masters,
    });
  } catch (err) {
    console.error("Fetch Masters Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMasterById = async (req, res) => {
    try {
        const { masterId } = req.body;
        const master = await User.findById(masterId).select("-password");

        if (!master || master.role !== "master") {
            return res.status(404).json({
                success: false,
                message: "Master not found",
            });
        }

        return res.status(200).json({ success: true, master });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateMaster = async (req, res) => {
    try {
        const {masterId, name, email, status } = req.body;

        const master = await User.findById(masterId);

        if (!master || master.role !== "master") {
            return res.status(404).json({
                success: false,
                message: "Master not found",
            });
        }

        if (req.files?.profilePhoto) {
            if (master.photoUrlPublicId) {
                await cloudinary.uploader.destroy(master.photoUrlPublicId);
            }
            master.photoUrl = req.files.profilePhoto[0].path;
            master.photoUrlPublicId = req.files.profilePhoto[0].filename;
        }

        if (name) master.name = name;
        if (email) master.email = email;
        if (status) master.status = status
        await master.save();

        return res.status(200).json({
            success: true,
            message: "Master updated successfully",
            master,
        });
    } catch (err) {
        console.error("Update Master Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteMaster = async (req, res) => {
  try {
    const { masterId } = req.body;
    const master = await User.findById(masterId);

    if (!master || master.role !== "master") {
      return res.status(404).json({
        success: false,
        message: "Master not found",
      });
    }

    if (master.photoUrlPublicId) {
      await cloudinary.uploader.destroy(master.photoUrlPublicId);
    }

    await master.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Master deleted successfully",
    });
  } catch (err) {
    console.error("Delete Master Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};