import express from "express";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getClientStats,
  getAllBranches,
} from "../controllers/client.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../utils/common/Uploads.js";

const router = express.Router();

// All routes are protected
router.use(isAuthenticated);

// Client routes
router.post("/create", upload, createClient);
router.get("/all", getAllClients);
router.post("/get-by-id", getClientById);
router.put("/update", upload, updateClient);
router.delete("/delete", deleteClient);
router.get("/stats", getClientStats);
router.get("/branches", getAllBranches);

export default router;
