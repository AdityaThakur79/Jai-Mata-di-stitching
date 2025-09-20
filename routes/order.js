import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  generateBill,
  getOrderStats,
  getCompletedOrdersStats,
  getAllOrdersStats,
  updateOrderStatus,
  updatePaymentStatus,
  updateBillPaymentStatus,
  getOrderForInvoice,
} from "../controllers/order.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// All routes are protected
router.use(isAuthenticated);

// Order routes
router.post("/create", createOrder);
router.get("/all", getAllOrders);
router.post("/get-by-id", getOrderById);
router.put("/update/:orderId", updateOrder);
router.delete("/delete", deleteOrder);
router.post("/generate-bill", generateBill);
router.get("/stats", getOrderStats);
router.get("/completed-stats", getCompletedOrdersStats);
router.get("/all-stats", getAllOrdersStats);
router.put("/update-status/:orderId", updateOrderStatus);
router.put("/update-payment/:orderId", updatePaymentStatus);
router.put("/update-bill-payment/:orderId", updateBillPaymentStatus);
router.get("/invoice-data/:orderId", getOrderForInvoice);

export default router;
