import express from "express";
import {
  createItemMaster,
  getAllItemMasters,
  getItemMasterById,
  updateItemMaster,
  deleteItemMaster,
} from "../controllers/item.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/common/Uploads.js";

const router = express.Router();

router.post("/create", upload ,  isAuthenticated, createItemMaster);
router.get("/all", getAllItemMasters);
router.post("/view", isAuthenticated, getItemMasterById);
router.put("/update", upload , isAuthenticated , updateItemMaster);
router.delete("/delete", isAuthenticated, deleteItemMaster);

export default router;
