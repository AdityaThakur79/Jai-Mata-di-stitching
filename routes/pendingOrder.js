import express from "express";
import {
  createPendingOrder,
  getAllPendingOrders,
  getPendingOrderById,
  deletePendingOrder,
  updatePendingOrder,
  // updatePendingOrderStatus,
  getPendingOrdersWithin24Hours,
  // printSlipByItemCode,
} from "../controllers/pendingOrder.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/common/Uploads.js";

const router = express.Router();

router.post("/create", isAuthenticated, upload, createPendingOrder);

router.put("/update", isAuthenticated, upload, updatePendingOrder);

router.get("/all", isAuthenticated, getAllPendingOrders);

router.get("/recent", isAuthenticated, getPendingOrdersWithin24Hours);

router.post("/view", isAuthenticated, getPendingOrderById);

// router.get("/slip/:itemCode", isAuthenticated, printSlipByItemCode);

router.delete("/delete", isAuthenticated, deletePendingOrder);

// router.patch("/update-status/:id", isAuthenticated, updatePendingOrderStatus);

export default router;
