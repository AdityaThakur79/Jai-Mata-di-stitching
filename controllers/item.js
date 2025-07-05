import ItemMaster from "../models/item.js";

export const createItemMaster = async (req, res) => {
  try {
    const { name, description, fields,stitchingCharge } = req.body;

    if (!name || !Array.isArray(fields)) {
      return res.status(400).json({
        success: false,
        message: "Name and fields are required and fields must be an array.",
      });
    }

    const existing = await ItemMaster.findOne({ name: name.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Item master with this name already exists.",
      });
    }

    const itemMaster = await ItemMaster.create({
      name: name.trim().toLowerCase(),
      description,
      fields,
      stitchingCharge
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
    let { page, limit, search } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
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
    const { itemId, itemType, description, fields,stitchingCharge } = req.body;

    const existingItem = await ItemMaster.findById(itemId);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item Master not found",
      });
    }

    existingItem.itemType = itemType || existingItem.itemType;
     existingItem.description = description || existingItem.description;
    existingItem.fields = fields || existingItem.fields;
    existingItem.stitchingCharge = stitchingCharge || existingItem.stitchingCharge;

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

