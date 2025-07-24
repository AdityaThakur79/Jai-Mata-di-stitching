import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/websiteService.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/common/Uploads.js";

const router = express.Router();

// Create a new service
router.post("/create", isAuthenticated, upload, createService);

// Get all services
router.get("/all", getAllServices);

// View service by ID
router.post("/view", isAuthenticated, getServiceById);

// Update service
router.put("/update", isAuthenticated, upload, updateService);

// Delete service
router.delete("/delete", isAuthenticated, deleteService);

export default router; 