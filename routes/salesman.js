import express from "express";
import {
  createSalesman,
  getAllSalesmen,
  getSalesmanById,
  updateSalesman,
  deleteSalesman,
} from "../controllers/salesman.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";
import upload from "../utils/common/Uploads.js";

const router = express.Router();

router.post("/create", isAuthenticated,isSuperAdmin,upload, createSalesman);
router.get("/all", isAuthenticated, getAllSalesmen);
router.post("/view", isAuthenticated, getSalesmanById);
router.put("/update", isAuthenticated, isSuperAdmin,upload,updateSalesman);
router.delete("/delete", isAuthenticated, isSuperAdmin, deleteSalesman);

export default router;
