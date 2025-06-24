import express from "express";
import {
  createItemMaster,
  getAllItemMasters,
  getItemMasterById,
  updateItemMaster,
  deleteItemMaster,
} from "../controllers/item.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, createItemMaster);
router.get("/all",isAuthenticated, getAllItemMasters);
router.post("/view", isAuthenticated, getItemMasterById);
router.put("/update",isAuthenticated , updateItemMaster);
router.delete("/delete", isAuthenticated, deleteItemMaster);

export default router;
