import StyleMaster from "../models/style.js";
import { v2 as cloudinary } from "cloudinary";

export const createStyle = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required.",
      });
    }

    const existing = await StyleMaster.findOne({ name, category });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Style with this name already exists for this category.",
      });
    }

    let styleImage = "";
    let styleImagePublicId = "";

    if (req.files?.styleImage) {
      styleImage = req.files.styleImage[0].path;
      styleImagePublicId = req.files.styleImage[0].filename;
    }

    const style = await StyleMaster.create({
      name,
      category,
      description,
      styleImage,
      styleImagePublicId,
    });

    res.status(201).json({
      success: true,
      message: "Style created successfully",
      style,
    });
  } catch (err) {
    console.error("Error creating style:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllStyles = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", category } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const styles = await StyleMaster.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StyleMaster.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Styles fetched successfully",
      styles,
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
      currentPageCount: styles.length,
    });
  } catch (err) {
    console.error("Error fetching styles:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch styles",
    });
  }
};

export const getStyleById = async (req, res) => {
  try {
    const { styleId } = req.body;

    const style = await StyleMaster.findById(styleId).populate("category", "name");
    if (!style) {
      return res.status(404).json({
        success: false,
        message: "Style not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Style fetched successfully",
      style,
    });
  } catch (err) {
    console.error("Error fetching style by ID:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateStyle = async (req, res) => {
  try {
    const { styleId, name, category, description, status } = req.body;
    const style = await StyleMaster.findById(styleId);

    if (!style) {
      return res.status(404).json({
        success: false,
        message: "Style not found",
      });
    }

    if (req.files?.styleImage) {
      // delete old image if exists
      if (style.styleImagePublicId) {
        await cloudinary.uploader.destroy(style.styleImagePublicId);
      }

      style.styleImage = req.files.styleImage[0].path;
      style.styleImagePublicId = req.files.styleImage[0].filename;
    }

    style.name = name || style.name;
    style.category = category || style.category;
    style.description = description || style.description;
    if (status !== undefined) style.status = status;

    await style.save();

    res.status(200).json({
      success: true,
      message: "Style updated successfully",
      style,
    });
  } catch (err) {
    console.error("Error updating style:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update style",
    });
  }
};

export const deleteStyle = async (req, res) => {
  try {
    const { styleId } = req.body;
    const style = await StyleMaster.findById(styleId);

    if (!style) {
      return res.status(404).json({
        success: false,
        message: "Style not found",
      });
    }

    if (style.styleImagePublicId) {
      await cloudinary.uploader.destroy(style.styleImagePublicId);
    }

    await style.deleteOne();

    res.status(200).json({
      success: true,
      message: "Style deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting style:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
