import express from "express";
import {
  createPendingOrder,
  getAllPendingOrders,
  getPendingOrderById,
  deletePendingOrder,
  updatePendingOrder,
  updatePendingOrderStatus,
  getPendingOrdersWithin24Hours,
  getTailorSlips,
  printTailorSlip,
  scanTailorSlip,
  getTailorSlipStats,
  getSlipWorkDetails,
  updatePendingOrderItemWork,
  getPendingOrderStockBuckets,
  updateTailorSlipStatus,
} from "../controllers/pendingOrder.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/common/Uploads.js";

const router = express.Router();

router.post("/create", isAuthenticated, upload, createPendingOrder);

router.put("/update", isAuthenticated, upload, updatePendingOrder);

router.get("/all", isAuthenticated, getAllPendingOrders);

router.get("/recent", isAuthenticated, getPendingOrdersWithin24Hours);
router.get("/slips", isAuthenticated, getTailorSlips);
router.get("/slips/stats", isAuthenticated, getTailorSlipStats);
router.post("/slips/scan", isAuthenticated, scanTailorSlip);
router.post("/slips/work-details", isAuthenticated, getSlipWorkDetails);
router.post("/slips/:slipId/print", isAuthenticated, printTailorSlip);
router.patch("/slips/:slipId/status", isAuthenticated, updateTailorSlipStatus);
router.put("/orders/:orderId/items/:itemCode", isAuthenticated, updatePendingOrderItemWork);
router.get("/stocks/buckets", isAuthenticated, getPendingOrderStockBuckets);

router.post("/view", isAuthenticated, getPendingOrderById);

// router.get("/slip/:itemCode", isAuthenticated, printSlipByItemCode);

router.delete("/delete", isAuthenticated, deletePendingOrder);
router.patch("/update-status/:id", isAuthenticated, updatePendingOrderStatus);

export default router;
