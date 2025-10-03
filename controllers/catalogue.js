import Catalogue from "../models/catalogue.js";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

export const getAllCatalogues = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, search } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (search && search.trim() !== "") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const [items, total] = await Promise.all([
      Catalogue.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Catalogue.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, catalogues: items, total, page: pageNum, totalPage: Math.ceil(total / limitNum) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

export const getCatalogueById = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Catalogue.findById(id);
    if (!cat) return res.status(404).json({ success: false, message: "Catalogue not found" });
    res.status(200).json({ success: true, catalogue: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

export const createCatalogue = async (req, res) => {
  try {
    const { name, description = "", type, category, driveUrl } = req.body;
    if (!name || !type || !category || !driveUrl) return res.status(400).json({ success: false, message: "Name, type, category and driveUrl are required" });

    const createdBy = (req.employee && req.employee._id) || (req.user && req.user._id) || undefined;

    // Handle featured image via common Uploads.js: field "galleryImage" or "categoryPrimaryImage" or generic
    const file = (req.files?.galleryImage?.[0]) || (req.files?.categoryPrimaryImage?.[0]) || (req.files?.profileImage?.[0]) || null;

    const cat = await Catalogue.create({
      name: name.trim(),
      description,
      type: type.trim(),
      category,
      driveUrl: driveUrl.trim(),
      ...(file ? { featuredImageUrl: file.path, featuredImagePublicId: file.filename || file.public_id } : {}),
      createdBy,
    });

    res.status(201).json({ success: true, message: "Catalogue created", catalogue: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

export const updateCatalogue = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, category, driveUrl } = req.body;
    const cat = await Catalogue.findById(id);
    if (!cat) return res.status(404).json({ success: false, message: "Catalogue not found" });

    if (name) cat.name = name.trim();
    if (description !== undefined) cat.description = description;
    if (type) cat.type = type.trim();
    if (category) cat.category = category;
    if (driveUrl) cat.driveUrl = driveUrl.trim();

    // Replace featured image if uploaded
    const file = (req.files?.galleryImage?.[0]) || (req.files?.categoryPrimaryImage?.[0]) || (req.files?.profileImage?.[0]) || null;
    if (file) {
      cat.featuredImageUrl = file.path;
      cat.featuredImagePublicId = file.filename || file.public_id;
    }

    await cat.save();
    res.status(200).json({ success: true, message: "Catalogue updated", catalogue: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

export const deleteCatalogue = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Catalogue.findById(id);
    if (!cat) return res.status(404).json({ success: false, message: "Catalogue not found" });

    await Catalogue.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Catalogue deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

// Stream PDF through our server so it can be embedded in an iframe
export const viewCataloguePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Catalogue.findById(id);
    if (!cat?.driveUrl) return res.status(404).json({ success: false, message: "PDF not found" });

    const previewUrl = `https://drive.google.com/viewerng/viewer?embedded=1&url=${encodeURIComponent(cat.driveUrl)}`;
    res.status(200).json({ success: true, previewUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};


