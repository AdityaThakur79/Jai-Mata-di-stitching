import FabricMaster from "../models/fabric.js";
import { v2 as cloudinary } from "cloudinary";

export const createFabric = async (req, res) => {
  try {
    const {
      name,
      type,
      color,
      pattern,
      pricePerMeter,
      inStockMeters,
      description,
    } = req.body;

    // Validate required fields
    if (!name || !color || !pricePerMeter) {
      return res.status(400).json({
        success: false,
        message: "Name, color, and pricePerMeter are required.",
      });
    }

    const existing = await FabricMaster.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Fabric with this name already exists.",
      });
    }

    let fabricImage = "";
    let fabricImagePublicId = "";
    if (req.files && req.files.fabricImage) {
      fabricImage = req.files.fabricImage[0].path;
      fabricImagePublicId = req.files.fabricImage[0].filename;
    }

    const fabric = await FabricMaster.create({
      name,
      type,
      color,
      pattern,
      pricePerMeter: parseFloat(pricePerMeter),
      inStockMeters: parseFloat(inStockMeters) || 0,
      fabricImage,
      fabricImagePublicId,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Fabric created successfully",
      fabric,
    });
  } catch (err) {
    console.error("Error creating fabric:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAllFabrics = async (req, res) => {
  try {
    let { page, limit, search } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
        { pattern: { $regex: search, $options: "i" } }
      ];
    }

    const fabrics = await FabricMaster.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FabricMaster.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Fabrics fetched successfully",
      fabrics,
      page,
      limit,
      total,
      currentPageCount: fabrics.length,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching fabrics:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching fabrics",
    });
  }
};

export const getFabricById = async (req, res) => {
  try {
    const { fabricId } = req.body;
    const fabric = await FabricMaster.findById(fabricId);
    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: "Fabric not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fabric fetched successfully",
      fabric,
    });
  } catch (err) {
    console.error("Error fetching fabric by ID:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updateFabric = async (req, res) => {
  try {
    const {
      fabricId,
      name,
      type,
      color,
      pattern,
      pricePerMeter,
      inStockMeters,
      description,
    } = req.body;

    const fabric = await FabricMaster.findById(fabricId);
    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: "Fabric not found",
      });
    }

    if (req.files && req.files.fabricImage) {
      if (fabric.fabricImagePublicId) {
        await cloudinary.uploader.destroy(fabric.fabricImagePublicId)
      }
      fabric.fabricImage = req.files.fabricImage[0].path;
      fabric.fabricImagePublicId = req.files.fabricImage[0].filename;
    }

    fabric.name = name || fabric.name;
    fabric.type = type || fabric.type;
    fabric.color = color || fabric.color;
    fabric.pattern = pattern || fabric.pattern;
    fabric.pricePerMeter = pricePerMeter ?? fabric.pricePerMeter;
    fabric.inStockMeters = inStockMeters ?? fabric.inStockMeters;
    fabric.description = description || fabric.description;

    await fabric.save();

    res.status(200).json({
      success: true,
      message: "Fabric updated successfully",
      fabric,
    });
  } catch (err) {
    console.error("Error updating fabric:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update fabric",
      error: err.message,
    });
  }
};

export const deleteFabric = async (req, res) => {
  try {
    const { fabricId } = req.body;

    const fabric = await FabricMaster.findById(fabricId);
    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: "Fabric not found",
      });
    }

    await fabric.deleteOne();

    res.status(200).json({
      success: true,
      message: "Fabric deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting fabric:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};