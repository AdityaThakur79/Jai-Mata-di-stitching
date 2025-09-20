import ItemMaster from "../models/item.js";
import { v2 as cloudinary } from "cloudinary";

export const createItemMaster = async (req, res) => {
  try {
    const { name, description, fields, stitchingCharge, category, styles } = req.body;

    if (!name || !Array.isArray(fields) || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, category, and fields are required and fields must be an array.",
      });
    }

    const existing = await ItemMaster.findOne({ name: name.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Item master with this name already exists.",
      });
    }

    let itemImage = "";
    let itemImagePublicId = "";
    let secondaryItemImage = "";
    let secondaryItemImagePublicId = "";
    if (req.files && req.files.itemImage) {
      itemImage = req.files.itemImage[0].path;
      itemImagePublicId = req.files.itemImage[0].filename;
    }
    if (req.files && req.files.secondaryItemImage) {
      secondaryItemImage = req.files.secondaryItemImage[0].path;
      secondaryItemImagePublicId = req.files.secondaryItemImage[0].filename;
    }

    // Parse styles if provided
    let parsedStyles = [];
    if (styles) {
      try {
        parsedStyles = JSON.parse(styles);
        if (!Array.isArray(parsedStyles)) {
          throw new Error("Styles must be an array");
        }
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Invalid styles format. Must be a valid JSON array.",
        });
      }
    }

    const itemMaster = await ItemMaster.create({
      name: name.trim().toLowerCase(),
      description,
      fields,
      stitchingCharge,
      category,
      styles: parsedStyles,
      itemImage,
      itemImagePublicId,
      secondaryItemImage,
      secondaryItemImagePublicId,
    });

    res.status(201).json({
      success: true,
      message: "Item master created successfully.",
      itemMaster,
    });
  } catch (err) {
    console.error("Error creating item master:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};

export const getAllItemMasters = async (req, res) => {
  try {
    let { page, limit, search, category } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    // Branch-based filtering
    const user = req.employee;
    if (user && !["director", "superAdmin"].includes(user.role)) {
      query.branchId = user.branchId;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category && ["men", "women", "unisex"].includes(category)) {
      query.category = category;
    }
    const items = await ItemMaster.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await ItemMaster.countDocuments(query);
    res.status(200).json({
      success: true,
      message: "Item masters fetched successfully",
      items,
      page,
      limit,
      total,
      currentPageCount: items.length,
      totalPage: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching item masters:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching item masters",
      error: err.message,
    });
  }
};

export const getItemMasterById = async (req, res) => {
  try {
    const { itemId } = req.body;

    const item = await ItemMaster.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item Master not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item Master fetched successfully",
      item,
    });
  } catch (err) {
    console.error("Error fetching item master:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updateItemMaster = async (req, res) => {
  try {
    const { itemId, name, description, fields, stitchingCharge, category, styles } = req.body;

    const existingItem = await ItemMaster.findById(itemId);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item Master not found",
      });
    }

    if (req.files && req.files.itemImage) {
      if (existingItem.itemImagePublicId) {
        await cloudinary.uploader.destroy(existingItem.itemImagePublicId);
      }
      existingItem.itemImage = req.files.itemImage[0].path;
      existingItem.itemImagePublicId = req.files.itemImage[0].filename;
    }
    if (req.files && req.files.secondaryItemImage) {
      if (existingItem.secondaryItemImagePublicId) {
        await cloudinary.uploader.destroy(existingItem.secondaryItemImagePublicId);
      }
      existingItem.secondaryItemImage = req.files.secondaryItemImage[0].path;
      existingItem.secondaryItemImagePublicId = req.files.secondaryItemImage[0].filename;
    }

    // Parse styles if provided
    if (styles !== undefined) {
      try {
        const parsedStyles = JSON.parse(styles);
        if (!Array.isArray(parsedStyles)) {
          throw new Error("Styles must be an array");
        }
        existingItem.styles = parsedStyles;
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Invalid styles format. Must be a valid JSON array.",
        });
      }
    }

    existingItem.name = name ? name.trim().toLowerCase() : existingItem.name;
    existingItem.description = description || existingItem.description;
    existingItem.fields = fields || existingItem.fields;
    existingItem.stitchingCharge = stitchingCharge || existingItem.stitchingCharge;
    if (category) existingItem.category = category;

    await existingItem.save();

    res.status(200).json({
      success: true,
      message: "Item Master updated successfully",
      itemMaster: existingItem,
    });
  } catch (err) {
    console.error("Error updating item master:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const deleteItemMaster = async (req, res) => {
  try {
    const { itemId } = req.body;

    const item = await ItemMaster.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item Master not found",
      });
    }
    // Delete images from Cloudinary
    if (item.itemImagePublicId) {
      await cloudinary.uploader.destroy(item.itemImagePublicId);
    }
    if (item.secondaryItemImagePublicId) {
      await cloudinary.uploader.destroy(item.secondaryItemImagePublicId);
    }
    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Item Master deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting item master:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

