import express from "express";
import {
  createMaster,
  getAllMasters,
  getMasterById,
  updateMaster,
  deleteMaster,
} from "../controllers/master.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";
import upload from "../utils/common/Uploads.js";

const router = express.Router();

router.post("/create",isAuthenticated,isSuperAdmin,upload, createMaster);
router.get("/all",isAuthenticated, getAllMasters);
router.post("/view",isAuthenticated, getMasterById);
router.put("/update",isAuthenticated,isSuperAdmin,upload, updateMaster);
router.delete("/delete",isAuthenticated,isSuperAdmin, deleteMaster);

export default router;
