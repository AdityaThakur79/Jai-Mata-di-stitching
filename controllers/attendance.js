import Attendance from "../models/attendance.js";
import Employee from "../models/employee.js";

// Mark attendance for employees
export const markAttendance = async (req, res) => {
  try {
    const { attendanceData, date } = req.body;
    // Handle both employee and user tokens
    const markedBy = req.employeeId || req.id;

    if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance data is required and must be an array",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // Parse the date to ensure it's at start of day (00:00:00)
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const results = {
      success: [],
      failed: [],
      updated: [],
    };

    // Process each attendance record
    for (const record of attendanceData) {
      try {
        const { employeeId, employeeName, status, checkInTime, checkOutTime, notes } = record;

        if (!employeeId || !status) {
          results.failed.push({
            employeeId,
            employeeName,
            reason: "Missing required fields",
          });
          continue;
        }

        // Check if attendance already exists for this employee and date
        const existingAttendance = await Attendance.findOne({
          employeeId,
          date: attendanceDate,
        });

        if (existingAttendance) {
          // Update existing attendance
          existingAttendance.status = status;
          existingAttendance.checkInTime = checkInTime || existingAttendance.checkInTime;
          existingAttendance.checkOutTime = checkOutTime || existingAttendance.checkOutTime;
          existingAttendance.notes = notes || existingAttendance.notes;
          existingAttendance.markedBy = markedBy;

          await existingAttendance.save();

          results.updated.push({
            employeeId,
            employeeName,
            status,
          });
        } else {
          // Create new attendance record
          const attendance = new Attendance({
            employeeId,
            employeeName,
            date: attendanceDate,
            status,
            checkInTime,
            checkOutTime,
            notes,
            markedBy,
          });

          await attendance.save();

          results.success.push({
            employeeId,
            employeeName,
            status,
          });
        }
      } catch (error) {
        console.error(`Error processing attendance for ${record.employeeId}:`, error);
        results.failed.push({
          employeeId: record.employeeId,
          employeeName: record.employeeName,
          reason: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get attendance for a specific date
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      date: attendanceDate,
    }).sort({ employeeName: 1 });

    res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      data: attendance,
      count: attendance.length,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get attendance for a specific employee
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate, month, year } = req.query;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    let query = { employeeId };

    // Handle date range filtering
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      query.date = { $gte: start, $lte: end };
    } else if (month !== undefined && year) {
      // Filter by month and year
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      const start = new Date(yearNum, monthNum, 1);
      const end = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);

      query.date = { $gte: start, $lte: end };
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });

    // Get employee details
    const employee = await Employee.findOne({ employeeId }).select(
      "name employeeId role mobile email"
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Calculate statistics
    const stats = {
      totalDays: attendance.length,
      present: attendance.filter((a) => a.status === "present").length,
      absent: attendance.filter((a) => a.status === "absent").length,
      leave: attendance.filter((a) => a.status === "leave").length,
      halfDay: attendance.filter((a) => a.status === "half-day").length,
    };

    res.status(200).json({
      success: true,
      message: "Employee attendance fetched successfully",
      data: {
        employee,
        attendance,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all employees with their attendance summary
export const getAllEmployeesAttendanceSummary = async (req, res) => {
  try {
    const { month, year, startDate, endDate } = req.query;

    // Get all active employees
    const employees = await Employee.find({ status: "active" })
      .select("name employeeId role mobile email joiningDate")
      .sort({ name: 1 });

    let dateFilter = {};

    // Handle date range filtering
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      dateFilter = { $gte: start, $lte: end };
    } else if (month !== undefined && year) {
      // Filter by month and year
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      const start = new Date(yearNum, monthNum, 1);
      const end = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);

      dateFilter = { $gte: start, $lte: end };
    } else {
      // Default to current month
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      dateFilter = { $gte: start, $lte: end };
    }

    // Get attendance data for all employees
    const employeesWithAttendance = await Promise.all(
      employees.map(async (employee) => {
        const attendance = await Attendance.find({
          employeeId: employee.employeeId,
          date: dateFilter,
        });

        const stats = {
          totalDays: attendance.length,
          present: attendance.filter((a) => a.status === "present").length,
          absent: attendance.filter((a) => a.status === "absent").length,
          leave: attendance.filter((a) => a.status === "leave").length,
          halfDay: attendance.filter((a) => a.status === "half-day").length,
        };

        // Calculate attendance percentage
        const totalWorkingDays = stats.present + stats.absent + stats.leave + stats.halfDay;
        const attendancePercentage = totalWorkingDays > 0
          ? ((stats.present + stats.halfDay * 0.5) / totalWorkingDays) * 100
          : 0;

        return {
          employee: employee.toObject(),
          stats,
          attendancePercentage: attendancePercentage.toFixed(2),
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Employees attendance summary fetched successfully",
      data: employeesWithAttendance,
      count: employeesWithAttendance.length,
    });
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete attendance record
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Attendance ID is required",
      });
    }

    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update attendance record
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, checkInTime, checkOutTime, notes } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Attendance ID is required",
      });
    }

    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    // Update fields
    if (status) attendance.status = status;
    if (checkInTime !== undefined) attendance.checkInTime = checkInTime;
    if (checkOutTime !== undefined) attendance.checkOutTime = checkOutTime;
    if (notes !== undefined) attendance.notes = notes;
    // Handle both employee and user tokens
    attendance.markedBy = req.employeeId || req.id;

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
