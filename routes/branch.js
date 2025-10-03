import express from "express";
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "../controllers/branch.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";

const router = express.Router();

// Create Branch (SuperAdmin/Director only)
router.post("/create", isAuthenticated, isSuperAdmin, createBranch);

// Get all Branches
router.get("/all", isAuthenticated, getAllBranches);

// Get Branch by ID
router.post("/get", isAuthenticated, getBranchById);

// Update Branch (SuperAdmin/Director only)
router.put("/update", isAuthenticated, isSuperAdmin, updateBranch);

// Delete Branch (SuperAdmin/Director only)
// Accepts branchId in body, query, or as /delete/:id
router.delete("/delete", isAuthenticated, isSuperAdmin, deleteBranch);
router.delete("/delete/:id", isAuthenticated, isSuperAdmin, deleteBranch);

export default router; 