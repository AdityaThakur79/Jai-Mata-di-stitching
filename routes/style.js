import express from "express";
import {
  createStyle,
  getAllStyles,
  getStyleById,
  updateStyle,
  deleteStyle,
} from "../controllers/style.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/common/Uploads.js";

const router = express.Router();

// Create a new style
router.post("/create", isAuthenticated, upload, createStyle);

// Get all styles with pagination and filters
router.get("/all", isAuthenticated, getAllStyles);

// View a style by ID
router.post("/view", isAuthenticated, getStyleById);

// Update a style
router.put("/update", isAuthenticated, upload, updateStyle);

// Delete a style
router.delete("/delete", isAuthenticated, deleteStyle);

export default router;
