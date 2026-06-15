import express from "express";
import {
  markAttendance,
  getAttendanceByDate,
  getEmployeeAttendance,
  getAllEmployeesAttendanceSummary,
  deleteAttendance,
  updateAttendance,
  autoMarkAbsent,
  updateAttendanceByDate,
} from "../controllers/attendance.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Mark attendance (bulk)
router.post("/mark", isAuthenticated, markAttendance);

// Auto-mark absent for unmarked employees
router.post("/auto-mark-absent", isAuthenticated, autoMarkAbsent);

// Update attendance by date (for superadmin/director)
router.post("/update-by-date", isAuthenticated, updateAttendanceByDate);

// Get attendance by date
router.get("/date", isAuthenticated, getAttendanceByDate);

// Get employee attendance
router.get("/employee/:employeeId", isAuthenticated, getEmployeeAttendance);

// Get all employees attendance summary
router.get("/summary", isAuthenticated, getAllEmployeesAttendanceSummary);

// Update attendance
router.put("/:id", isAuthenticated, updateAttendance);

// Delete attendance
router.delete("/:id", isAuthenticated, deleteAttendance);

export default router;
