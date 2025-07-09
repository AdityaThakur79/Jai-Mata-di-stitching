import express from "express";
import {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  updateInvoice,
  generateInvoicePDF,
  getInvoiceHTML,
  updatePaymentStatus,
  deleteInvoice,
} from "../controllers/invoice.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Create invoice from pending order
router.post("/create", isAuthenticated, createInvoice);

// Get all invoices with pagination and search
router.get("/all", isAuthenticated, getAllInvoices);

// Get invoice by ID
router.get("/:invoiceId", isAuthenticated, getInvoiceById);

// Update invoice
router.put("/:invoiceId", isAuthenticated, updateInvoice);

// Generate PDF invoice
router.get("/:invoiceId/pdf", isAuthenticated, generateInvoicePDF);

// Get HTML invoice (fallback)
router.get("/:invoiceId/html", isAuthenticated, getInvoiceHTML);

// Update payment status
router.patch("/:invoiceId/payment", isAuthenticated, updatePaymentStatus);

// Delete invoice
router.delete("/:invoiceId", isAuthenticated, deleteInvoice);

export default router; 