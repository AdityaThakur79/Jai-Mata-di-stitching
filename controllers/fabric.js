import FabricMaster from "../models/fabric.js";
import { v2 as cloudinary } from "cloudinary";
import bwipjs from "bwip-js";
import nodemailer from "nodemailer";

// Email configuration for restock notifications (only create if credentials exist)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

const parseNumberField = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const parseIntField = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

// Helper function to generate barcode image
const generateBarcodeImage = async (barcodeValue, { compact = false } = {}) => {
  try {
    const png = await bwipjs.toBuffer({
      bcid: "code128",
      text: barcodeValue,
      scale: compact ? 2 : 3,
      height: compact ? 6 : 10,
      includetext: !compact,
      textxalign: "center",
    });
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch (error) {
    console.error("Error generating barcode:", error);
    throw new Error("Failed to generate barcode");
  }
};

// Helper function to send restock email
const sendRestockEmail = async (fabric) => {
  if (!fabric.restockEmail || !transporter) {
    console.log("Email not sent: No transporter configured or no recipient email");
    return;
  }
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: fabric.restockEmail,
      subject: `Stock Alert: ${fabric.name} - Below Threshold`,
      html: `
        <h2>Stock Alert Notification</h2>
        <p>The following fabric is running low on stock:</p>
        <ul>
          <li><strong>SRN:</strong> ${fabric.srn}</li>
          <li><strong>Fabric Name:</strong> ${fabric.name}</li>
          <li><strong>Current Stock:</strong> ${fabric.inStockMeters} meters</li>
          <li><strong>Threshold:</strong> ${fabric.thresholdValue} meters</li>
          <li><strong>Type:</strong> ${fabric.type}</li>
          <li><strong>Color:</strong> ${fabric.color}</li>
        </ul>
        <p>Please restock this fabric as soon as possible.</p>
      `,
    });
    console.log(`Restock email sent to ${fabric.restockEmail}`);
  } catch (error) {
    console.error("Error sending restock email:", error);
  }
};

export const createFabric = async (req, res) => {
  try {
    const {
      name,
      hsnCode,
      type,
      color,
      pattern,
      pricePerMeter,
      inStockMeters,
      length,
      width,
      fabricBarcodeCount,
      thresholdValue,
      restockEmail,
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
    let secondaryFabricImage = "";
    let secondaryFabricImagePublicId = "";
    if (req.files && req.files.fabricImage) {
      fabricImage = req.files.fabricImage[0].path;
      fabricImagePublicId = req.files.fabricImage[0].filename;
    }
    if (req.files && req.files.secondaryFabricImage) {
      secondaryFabricImage = req.files.secondaryFabricImage[0].path;
      secondaryFabricImagePublicId = req.files.secondaryFabricImage[0].filename;
    }

    const fabric = await FabricMaster.create({
      name,
      hsnCode: hsnCode || "",
      type,
      color,
      pattern,
      pricePerMeter: parseFloat(pricePerMeter),
      inStockMeters: parseFloat(inStockMeters) || 0,
      length: parseFloat(length) || 0,
      width: parseFloat(width) || 0,
      fabricBarcodeCount: parseInt(fabricBarcodeCount) || 5,
      thresholdValue: parseFloat(thresholdValue) || 10,
      restockEmail: restockEmail || "",
      fabricImage,
      fabricImagePublicId,
      secondaryFabricImage,
      secondaryFabricImagePublicId,
      description,
    });

    // Check if stock is below threshold on creation
    if (fabric.inStockMeters <= fabric.thresholdValue && fabric.restockEmail) {
      await sendRestockEmail(fabric);
    }

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
    // Branch-based filtering
    const user = req.employee;
    if (user && !["director", "superAdmin"].includes(user.role)) {
      query.branchId = user.branchId;
    }
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
      hsnCode,
      type,
      color,
      pattern,
      pricePerMeter,
      inStockMeters,
      length,
      width,
      fabricBarcodeCount,
      thresholdValue,
      restockEmail,
      description,
    } = req.body;

    const fabric = await FabricMaster.findById(fabricId);
    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: "Fabric not found",
      });
    }

    const previousStock = fabric.inStockMeters;

    if (req.files && req.files.fabricImage) {
      if (fabric.fabricImagePublicId) {
        await cloudinary.uploader.destroy(fabric.fabricImagePublicId)
      }
      fabric.fabricImage = req.files.fabricImage[0].path;
      fabric.fabricImagePublicId = req.files.fabricImage[0].filename;
    }
    if (req.files && req.files.secondaryFabricImage) {
      if (fabric.secondaryFabricImagePublicId) {
        await cloudinary.uploader.destroy(fabric.secondaryFabricImagePublicId)
      }
      fabric.secondaryFabricImage = req.files.secondaryFabricImage[0].path;
      fabric.secondaryFabricImagePublicId = req.files.secondaryFabricImage[0].filename;
    }

    fabric.name = name || fabric.name;
    fabric.hsnCode = hsnCode !== undefined ? hsnCode : fabric.hsnCode;
    fabric.type = type || fabric.type;
    fabric.color = color || fabric.color;
    fabric.pattern = pattern !== undefined ? pattern : fabric.pattern;
    fabric.pricePerMeter = pricePerMeter !== undefined ? pricePerMeter : fabric.pricePerMeter;
    fabric.inStockMeters = parseNumberField(inStockMeters, fabric.inStockMeters);
    fabric.length = parseNumberField(length, fabric.length);
    fabric.width = parseNumberField(width, fabric.width);
    fabric.fabricBarcodeCount = parseIntField(fabricBarcodeCount, fabric.fabricBarcodeCount);
    fabric.thresholdValue = parseNumberField(thresholdValue, fabric.thresholdValue);
    fabric.restockEmail = restockEmail !== undefined ? restockEmail : fabric.restockEmail;
    fabric.description = description !== undefined ? description : fabric.description;

    await fabric.save();

    // Check if stock crossed threshold
    if (previousStock > fabric.thresholdValue && 
        fabric.inStockMeters <= fabric.thresholdValue && 
        fabric.restockEmail) {
      await sendRestockEmail(fabric);
    }

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
    // Delete images from Cloudinary
    if (fabric.fabricImagePublicId) {
      await cloudinary.uploader.destroy(fabric.fabricImagePublicId);
    }
    if (fabric.secondaryFabricImagePublicId) {
      await cloudinary.uploader.destroy(fabric.secondaryFabricImagePublicId);
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

// Print fabric barcode stickers
export const printFabricBarcode = async (req, res) => {
  try {
    const { fabricId } = req.body;

    const fabric = await FabricMaster.findById(fabricId);
    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: "Fabric not found",
      });
    }

    const barcodeValue = fabric.barcodeValue || fabric.srn;

    // Generate barcode images — full for header, compact for sticker grid
    const barcodeImage = await generateBarcodeImage(barcodeValue);
    const compactBarcodeImage = await generateBarcodeImage(barcodeValue, { compact: true });

    // Increment print count
    fabric.printCount = (fabric.printCount || 0) + 1;
    await fabric.save();

    res.status(200).json({
      success: true,
      message: "Fabric barcode data retrieved",
      fabric,
      barcodeImage,
      compactBarcodeImage,
      printMeta: {
        printCount: fabric.printCount,
        timestamp: new Date(),
      },
    });
  } catch (err) {
    console.error("Error printing fabric barcode:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate barcode",
      error: err.message,
    });
  }
};