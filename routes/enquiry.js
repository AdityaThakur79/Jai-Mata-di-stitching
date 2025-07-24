import express from "express";
import {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryStats,
} from "../controllers/enquiry.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Create a new enquiry (public route)
router.post("/create", createEnquiry);

// Get all enquiries (protected)
router.get("/all", isAuthenticated, getAllEnquiries);

// Get enquiry statistics (protected)
router.get("/stats", isAuthenticated, getEnquiryStats);

// View enquiry by ID (protected)
router.post("/view", isAuthenticated, getEnquiryById);

// Update enquiry (protected)
router.put("/update", isAuthenticated, updateEnquiry);

// Delete enquiry (protected)
router.delete("/delete", isAuthenticated, deleteEnquiry);

export default router; 