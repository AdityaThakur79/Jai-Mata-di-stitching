import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  generateEmployeeIdCardPdf,
} from "../controllers/employee.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/common/Uploads.js";

const router = express.Router();

// Create Employee
router.post("/create",isAuthenticated,upload, createEmployee);

// Get all Employees
router.get("/all",isAuthenticated, getAllEmployees);

// Get Employee by ID
router.post("/get",isAuthenticated, getEmployeeById);

// Update Employee
router.put("/update",isAuthenticated,upload, updateEmployee);

// Delete Employee
router.delete("/delete",isAuthenticated, deleteEmployee);

// Generate Employee ID Card PDF
router.post("/idcard-pdf",isAuthenticated, generateEmployeeIdCardPdf);

export default router; 