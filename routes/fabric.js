import express from "express";
import {
  createFabric,
  getAllFabrics,
  getFabricById,
  updateFabric,
  deleteFabric,
} from "../controllers/fabric.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/common/Uploads.js";

const router = express.Router();

// Create a new fabric
router.post("/create", isAuthenticated,upload, createFabric);

// Get all fabrics
router.get("/all", isAuthenticated, getAllFabrics);

// View fabric by ID
router.post("/view", isAuthenticated, getFabricById);

// Update fabric
router.put("/update", isAuthenticated,upload, updateFabric);

// Delete fabric
router.delete("/delete", isAuthenticated, deleteFabric);

export default router;
