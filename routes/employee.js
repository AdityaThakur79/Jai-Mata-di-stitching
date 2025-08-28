import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  addEmployeeAdvance,
  getEmployeeAdvances,
  getAllEmployeeAdvances,
  deleteEmployeeAdvance,
  generateSalarySlip,
  sendSalarySlipEmailController,
  employeeLogin,
  getEmployeeProfile,
  getEmployeeSalarySlips,
  downloadEmployeeSalarySlip,
  getFilteredEmployeeDetails,
} from "../controllers/employee.js";
import { isAuthenticated, isEmployeeAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../utils/common/Uploads.js";

const router = express.Router();

// Employee Login (no authentication required)
router.post("/login", employeeLogin);

// Employee-specific routes (require employee authentication)
router.get("/profile", isEmployeeAuthenticated, getEmployeeProfile);
router.get("/salary-slips", isEmployeeAuthenticated, getEmployeeSalarySlips);
router.post("/download-salary-slip", isEmployeeAuthenticated, downloadEmployeeSalarySlip);

// Admin routes (require admin authentication)
router.post("/create",isAuthenticated,upload, createEmployee);

// Get all Employees
router.get("/all",isAuthenticated, getAllEmployees);

// Get Employee by ID
router.post("/get",isAuthenticated, getEmployeeById);

// Update Employee
router.put("/update",isAuthenticated,upload, updateEmployee);

// Delete Employee
router.delete("/delete",isAuthenticated, deleteEmployee);

// Employee Advance Payment Routes
router.post("/advance", isAuthenticated, addEmployeeAdvance);
router.post("/get-advance", isAuthenticated, getEmployeeAdvances);
router.get("/advances", isAuthenticated, getAllEmployeeAdvances);
router.delete("/delete-advance", isAuthenticated, deleteEmployeeAdvance);
router.post("/generate-salary-slip", isAuthenticated, generateSalarySlip);
router.post("/send-salary-slip-email", isAuthenticated, sendSalarySlipEmailController);

// Filtered Employee Details Route
router.post("/filtered-details", isAuthenticated, getFilteredEmployeeDetails);

export default router; 