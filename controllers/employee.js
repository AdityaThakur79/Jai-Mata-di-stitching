import Employee from "../models/employee.js";
import moment from "moment";
import puppeteer from "puppeteer";
import bwipjs from "bwip-js";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { sendSalarySlipEmail } from "../utils/common/sendMail.js";
import jwt from "jsonwebtoken";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to generate next Employee ID for the month
async function generateEmployeeId() {
  const prefix = "JMD";
  const now = moment();
  const yearMonth = now.format("YYYYMM");
  // Find the latest employee for this month
  const lastEmployee = await Employee.findOne({ employeeId: { $regex: `^${prefix}-${yearMonth}-` } })
    .sort({ createdAt: -1 });
  let nextSeq = 1;
  if (lastEmployee && lastEmployee.employeeId) {
    const parts = lastEmployee.employeeId.split("-");
    nextSeq = parseInt(parts[2], 10) + 1;
  }
  const employeeId = `${prefix}-${yearMonth}-${String(nextSeq).padStart(4, "0")}`;
  return employeeId;
}

// Helper function to delete image from Cloudinary
async function deleteFromCloudinary(publicId) {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
  }
}

export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      password,
      gender,
      address,
      aadhaarNumber,
      role,
      joiningDate,
      bloodGroup,
      grade,
      dob,
      baseSalary,
      bankDetails,
      emergencyContact,
    } = req.body;
   
    if (!name || !mobile || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, mobile, role, and password are required.",
      });
    }

    const existing = await Employee.findOne({ mobile });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Employee with this mobile already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Calculate validity date (1 year from creation)
    const validityDate = new Date();
    validityDate.setFullYear(validityDate.getFullYear() + 1);

    let profileImage = "";
    let aadhaarImage = "";
    let aadhaarPublicId = "";

    // Handle profile image upload (from upload middleware)
    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
      profileImage = req.files.profileImage[0].path;
    }

    // Handle Aadhaar image upload (from upload middleware)
    if (req.files && req.files.aadhaarImage && req.files.aadhaarImage[0]) {
      aadhaarImage = req.files.aadhaarImage[0].path;
      aadhaarPublicId = req.files.aadhaarImage[0].filename;
    }

    const employeeId = await generateEmployeeId();
    const newEmployee = await Employee.create({
      name,
      mobile,
      email,
      password: hashedPassword,
      gender,
      address,
      aadhaarNumber,
      aadhaarImage,
      aadhaarPublicId,
      role,
      employeeId,
      joiningDate,
      bloodGroup,
      grade,
      dob,
      baseSalary: baseSalary ? parseFloat(baseSalary) : undefined,
      validityDate,
      profileImage,
      bankDetails: bankDetails ? JSON.parse(bankDetails) : undefined,
      emergencyContact: emergencyContact ? JSON.parse(emergencyContact) : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    let { page, limit, search, status } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { bloodGroup: { $regex: search, $options: "i" } },
        { grade: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "") {
      query.status = status;
      console.log("Filtering by status:", status);
      console.log("Query object:", query);
    }
    
    console.log("Final query:", JSON.stringify(query, null, 2));
    
    const employees = await Employee.find(query)
      .select("-password") // Exclude password from response
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Employee.countDocuments(query);
    
    console.log(`Found ${employees.length} employees out of ${total} total`);
    console.log("Employee statuses:", employees.map(emp => ({ id: emp.employeeId, status: emp.status })));
    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      employees,
      page,
      limit,
      total,
      currentPageCount: employees.length,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching employees",
    });
  }
};


export const getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findOne({ employeeId }).select("-password");
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      employee,
    });
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};


export const updateEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      mobile,
      email,
      password,
      gender,
      address,
      aadhaarNumber,
      joiningDate,
      role,
      designation,
      status,
      bloodGroup,
      grade,
      dob,
      baseSalary,
      advancePayments,
      salarySlips,
      documents,
      bankDetails,
      emergencyContact,
      barcode,
      existingAadhaarPublicId
    } = req.body;
    const existingEmployee = await Employee.findOne({ employeeId });
    if (!existingEmployee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    let profileImage = existingEmployee.profileImage;
    let aadhaarImage = existingEmployee.aadhaarImage;
    let aadhaarPublicId = existingEmployee.aadhaarPublicId;

    // Handle profile image upload (from upload middleware)
    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
      profileImage = req.files.profileImage[0].path;
      // Delete old profile image if it exists
      if (existingEmployee.profileImage && existingEmployee.profileImage.includes('cloudinary')) {
        const oldPublicId = existingEmployee.profileImage.split('/').pop().split('.')[0];
        await deleteFromCloudinary(oldPublicId);
      }
    }

    // Handle Aadhaar image upload (from upload middleware)
    if (req.files && req.files.aadhaarImage && req.files.aadhaarImage[0]) {
      aadhaarImage = req.files.aadhaarImage[0].path;
      aadhaarPublicId = req.files.aadhaarImage[0].filename;
      // Delete old Aadhaar image if it exists
      if (existingEmployee.aadhaarPublicId) {
        await deleteFromCloudinary(existingEmployee.aadhaarPublicId);
      }
    }

    // Handle Aadhaar image removal (when user wants to remove existing image)
    if (existingAadhaarPublicId && !req.files?.aadhaarImage) {
      await deleteFromCloudinary(existingAadhaarPublicId);
      aadhaarImage = "";
      aadhaarPublicId = "";
    }

    existingEmployee.name = name || existingEmployee.name;
    existingEmployee.mobile = mobile || existingEmployee.mobile;
    existingEmployee.email = email || existingEmployee.email;
    if (password) {
      existingEmployee.password = await bcrypt.hash(password, 10);
    }
    existingEmployee.gender = gender || existingEmployee.gender;
    existingEmployee.address = address || existingEmployee.address;
    existingEmployee.aadhaarNumber = aadhaarNumber || existingEmployee.aadhaarNumber;
    existingEmployee.aadhaarImage = aadhaarImage;
    existingEmployee.aadhaarPublicId = aadhaarPublicId;
    existingEmployee.joiningDate = joiningDate || existingEmployee.joiningDate;
    existingEmployee.role = role || existingEmployee.role;
    existingEmployee.designation = designation || existingEmployee.designation;
    existingEmployee.status = status || existingEmployee.status;
    existingEmployee.bloodGroup = bloodGroup || existingEmployee.bloodGroup;
    existingEmployee.grade = grade || existingEmployee.grade;
    existingEmployee.dob = dob || existingEmployee.dob;
    existingEmployee.baseSalary = baseSalary ? parseFloat(baseSalary) : existingEmployee.baseSalary;
    existingEmployee.advancePayments = advancePayments ? JSON.parse(advancePayments) : existingEmployee.advancePayments;
    existingEmployee.salarySlips = salarySlips ? JSON.parse(salarySlips) : existingEmployee.salarySlips;
    existingEmployee.profileImage = profileImage;
    existingEmployee.documents = documents ? JSON.parse(documents) : existingEmployee.documents;
    existingEmployee.bankDetails = bankDetails ? JSON.parse(bankDetails) : existingEmployee.bankDetails;
    existingEmployee.emergencyContact = emergencyContact ? JSON.parse(emergencyContact) : existingEmployee.emergencyContact;
    existingEmployee.barcode = barcode || existingEmployee.barcode;
    await existingEmployee.save();
    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: existingEmployee,
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Delete images from Cloudinary before deleting employee
    if (employee.aadhaarPublicId) {
      await deleteFromCloudinary(employee.aadhaarPublicId);
    }
    if (employee.profileImage && employee.profileImage.includes('cloudinary')) {
      const profilePublicId = employee.profileImage.split('/').pop().split('.')[0];
      await deleteFromCloudinary(profilePublicId);
    }

    await employee.deleteOne();
    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

// Employee Advance Payment Controllers
export const addEmployeeAdvance = async (req, res) => {
  try {
    const { employeeId, amount, reason, date } = req.body;

    if (!employeeId || !amount || !reason) {
      return res.status(400).json({
        success: false,
        message: "Employee ID, amount, and reason are required.",
      });
    }

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Calculate total advance amount for current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const currentMonthAdvances = employee.advancePayments.filter(advance => {
      const advanceDate = new Date(advance.date);
      return advanceDate.getMonth() === currentMonth && advanceDate.getFullYear() === currentYear;
    });
    
    const totalCurrentMonthAdvance = currentMonthAdvances.reduce((sum, advance) => sum + advance.amount, 0);
    const newTotalAdvance = totalCurrentMonthAdvance + parseFloat(amount);

    // Check if advance amount exceeds monthly base salary
    if (newTotalAdvance > employee.baseSalary) {
      return res.status(400).json({
        success: false,
        message: `Total advance amount for this month (${newTotalAdvance}) cannot exceed monthly base salary (${employee.baseSalary})`,
      });
    }

    // Add new advance payment
    const newAdvance = {
      amount: parseFloat(amount),
      reason,
      date: date ? new Date(date) : new Date(),
    };

    employee.advancePayments.push(newAdvance);
    await employee.save();

    // Calculate remaining amount for current month
    const remainingAmount = employee.baseSalary - newTotalAdvance;

    res.status(201).json({
      success: true,
      message: "Advance payment added successfully",
      data: {
        advance: newAdvance,
        totalCurrentMonthAdvance: newTotalAdvance,
        remainingAmount,
        baseSalary: employee.baseSalary,
      },
    });
  } catch (err) {
    console.error("Error adding employee advance:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getEmployeeAdvances = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required.",
      });
    }

    const employee = await Employee.findOne({ employeeId }).select("advancePayments baseSalary name employeeId salarySlips");
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Group advances by month
    const advancesByMonth = {};
    employee.advancePayments.forEach(advance => {
      const date = new Date(advance.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      if (!advancesByMonth[monthKey]) {
        advancesByMonth[monthKey] = {
          month: monthName,
          monthKey: monthKey,
          advances: [],
          totalAdvance: 0,
          remainingAmount: employee.baseSalary,
          salarySlip: null
        };
      }
      
      advancesByMonth[monthKey].advances.push(advance);
      advancesByMonth[monthKey].totalAdvance += advance.amount;
      advancesByMonth[monthKey].remainingAmount = employee.baseSalary - advancesByMonth[monthKey].totalAdvance;
    });

    // Add salary slip data if exists
    employee.salarySlips.forEach(slip => {
      const slipDate = new Date(slip.generatedAt);
      const monthKey = `${slipDate.getFullYear()}-${String(slipDate.getMonth() + 1).padStart(2, '0')}`;
      if (advancesByMonth[monthKey]) {
        advancesByMonth[monthKey].salarySlip = slip;
      }
    });

    // Convert to array and sort by month (newest first)
    const monthlyData = Object.values(advancesByMonth).sort((a, b) => b.monthKey.localeCompare(a.monthKey));

    res.status(200).json({
      success: true,
      message: "Employee advances fetched successfully",
      data: {
        employee: {
          name: employee.name,
          employeeId: employee.employeeId,
          baseSalary: employee.baseSalary,
        },
        monthlyData: monthlyData,
        totalAdvances: employee.advancePayments.length,
      },
    });
  } catch (err) {
    console.error("Error fetching employee advances:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAllEmployeeAdvances = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await Employee.find(query)
      .select("name employeeId baseSalary advancePayments salarySlips")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Employee.countDocuments(query);

    const employeesWithAdvances = employees.map(employee => {
      // Calculate current month advances
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const currentMonthAdvances = employee.advancePayments.filter(advance => {
        const advanceDate = new Date(advance.date);
        return advanceDate.getMonth() === currentMonth && advanceDate.getFullYear() === currentYear;
      });
      
      const totalCurrentMonthAdvance = currentMonthAdvances.reduce((sum, advance) => sum + advance.amount, 0);
      const remainingAmount = employee.baseSalary - totalCurrentMonthAdvance;

      // Get last 6 months data
      const monthlyData = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        
        const monthAdvances = employee.advancePayments.filter(advance => {
          const advanceDate = new Date(advance.date);
          return advanceDate.getMonth() === date.getMonth() && advanceDate.getFullYear() === date.getFullYear();
        });
        
        const monthTotalAdvance = monthAdvances.reduce((sum, advance) => sum + advance.amount, 0);
        const monthRemaining = employee.baseSalary - monthTotalAdvance;
        
        // Find salary slip for this month
        const salarySlip = employee.salarySlips.find(slip => {
          const slipDate = new Date(slip.generatedAt);
          return slipDate.getMonth() === date.getMonth() && slipDate.getFullYear() === date.getFullYear();
        });
        
        monthlyData.push({
          month: monthName,
          monthKey: monthKey,
          baseSalary: employee.baseSalary,
          advances: monthAdvances,
          totalAdvance: monthTotalAdvance,
          remainingAmount: monthRemaining,
          salarySlip: salarySlip,
          advanceCount: monthAdvances.length
        });
      }

      return {
        employee: {
          name: employee.name,
          employeeId: employee.employeeId,
          baseSalary: employee.baseSalary,
        },
        currentMonth: {
          totalAdvance: totalCurrentMonthAdvance,
          remainingAmount: remainingAmount,
          advanceCount: currentMonthAdvances.length
        },
        monthlyData: monthlyData,
        totalAdvances: employee.advancePayments.length,
      };
    });

    res.status(200).json({
      success: true,
      message: "All employee advances fetched successfully",
      data: employeesWithAdvances,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("Error fetching all employee advances:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const deleteEmployeeAdvance = async (req, res) => {
  try {
    const { employeeId, advanceId } = req.body;

    if (!employeeId || !advanceId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and Advance ID are required.",
      });
    }

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Find and remove the specific advance
    const advanceIndex = employee.advancePayments.findIndex(
      advance => advance._id.toString() === advanceId
    );

    if (advanceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Advance payment not found",
      });
    }

    const deletedAdvance = employee.advancePayments[advanceIndex];
    employee.advancePayments.splice(advanceIndex, 1);
    await employee.save();

    // Calculate new totals for current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const currentMonthAdvances = employee.advancePayments.filter(advance => {
      const advanceDate = new Date(advance.date);
      return advanceDate.getMonth() === currentMonth && advanceDate.getFullYear() === currentYear;
    });
    
    const totalCurrentMonthAdvance = currentMonthAdvances.reduce((sum, advance) => sum + advance.amount, 0);
    const remainingAmount = employee.baseSalary - totalCurrentMonthAdvance;

    res.status(200).json({
      success: true,
      message: "Advance payment deleted successfully",
      data: {
        deletedAdvance,
        totalCurrentMonthAdvance,
        remainingAmount,
        baseSalary: employee.baseSalary,
      },
    });
  } catch (err) {
    console.error("Error deleting employee advance:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Generate Salary Slip
export const generateSalarySlip = async (req, res) => {
  try {
    const { employeeId, month } = req.body;

    if (!employeeId || !month) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and month are required.",
      });
    }

    // Parse month to 'YYYY-MM' format
    let slipMonthKey = "";
    if (/\d{4}-\d{2}/.test(month)) {
      // Already in 'YYYY-MM' format
      slipMonthKey = month;
    } else {
      // Try to parse e.g. 'July 2024' or 'Jul 2024'
      const date = new Date(month + " 1");
      if (!isNaN(date)) {
        slipMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid month format. Use 'YYYY-MM' or 'Month YYYY' (e.g., '2024-07' or 'July 2024').",
        });
      }
    }

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Check if salary slip already exists for this month
    const existingSlip = employee.salarySlips.find(slip => slip.monthKey === slipMonthKey);
    if (existingSlip) {
      return res.status(400).json({
        success: false,
        message: "Salary slip already exists for this month",
      });
    }

    // Calculate advances for the specified month
    const [year, monthNum] = slipMonthKey.split('-').map(Number);
    const monthAdvances = employee.advancePayments.filter(advance => {
      const advanceDate = new Date(advance.date);
      return advanceDate.getFullYear() === year && (advanceDate.getMonth() + 1) === monthNum;
    });

    const totalAdvances = monthAdvances.reduce((sum, advance) => sum + advance.amount, 0);
    const finalPayable = employee.baseSalary - totalAdvances;

    // Create salary slip
    const salarySlip = {
      month: month, // original label (e.g., 'July 2024')
      monthKey: slipMonthKey, // 'YYYY-MM' for robust comparison
      basicSalary: employee.baseSalary,
      advancesDeducted: totalAdvances,
      finalPayable: finalPayable,
      generatedAt: new Date(),
      notes: `Generated on ${new Date().toLocaleDateString()}`
    };

    employee.salarySlips.push(salarySlip);
    await employee.save();

    // Generate PDF with Puppeteer
    const logoPath = path.join(process.cwd(), "client/public/images/jmd_logo.jpeg");
    const logoDataUrl = `data:image/jpeg;base64,${fs.readFileSync(logoPath).toString("base64")}`;
    const slipHtml = `
      <html>
        <head>
          <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' rel='stylesheet'>
        </head>
        <body style="font-family:'Inter',sans-serif;background:#f8fafc;margin:0;padding:0;">
          <div style="max-width:520px;margin:40px auto;background:white;border-radius:18px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">
            <div style="background:linear-gradient(90deg,#ff9800 0%,#1976d2 100%);padding:24px 0;text-align:center;">
              <img src='${logoDataUrl}' style="height:48px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:8px;" />
              <h1 style="color:white;font-size:2rem;margin:0;font-weight:700;letter-spacing:1px;">JMD STITCHING</h1>
              <div style="color:#fff;font-size:1.1rem;opacity:0.85;">Salary Slip</div>
              <div style="color:#fff;font-size:1rem;opacity:0.7;">${salarySlip.month}</div>
            </div>
            <div style="padding:32px 28px 24px 28px;">
              <table style="width:100%;font-size:1rem;margin-bottom:24px;">
                <tr><td style="color:#888;padding:4px 0;">Employee Name:</td><td style="font-weight:600;">${employee.name}</td></tr>
                <tr><td style="color:#888;padding:4px 0;">Employee ID:</td><td style="font-weight:600;">${employee.employeeId}</td></tr>
                <tr><td style="color:#888;padding:4px 0;">Designation:</td><td style="font-weight:600;">${employee.designation || '—'}</td></tr>
                <tr><td style="color:#888;padding:4px 0;">Month:</td><td style="font-weight:600;">${salarySlip.month}</td></tr>
              </table>
              <div style="background:#f3f4f6;border-radius:12px;padding:20px 18px 12px 18px;margin-bottom:24px;">
                <h3 style="margin:0 0 12px 0;font-size:1.1rem;color:#1976d2;font-weight:700;">Salary Breakdown</h3>
                <table style="width:100%;font-size:1rem;">
                  <tr>
                    <td style="color:#666;padding:6px 0;">Basic Salary:</td>
                    <td style="font-weight:600;color:#388e3c;">₹${salarySlip.basicSalary.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td style="color:#666;padding:6px 0;">Advances Deducted:</td>
                    <td style="font-weight:600;color:#d32f2f;">-₹${salarySlip.advancesDeducted.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style="border-top:2px solid #1976d2;">
                    <td style="padding:12px 0;font-weight:700;font-size:1.1rem;">Final Payable:</td>
                    <td style="padding:12px 0;font-weight:700;font-size:1.1rem;color:#1976d2;">₹${salarySlip.finalPayable.toLocaleString('en-IN')}</td>
                  </tr>
                </table>
              </div>
              <div style="background:#fff3e0;border-radius:8px;padding:12px 16px;margin-bottom:18px;color:#ff9800;font-size:0.98rem;">
                <b>Notes:</b> ${salarySlip.notes || 'No additional notes'}
              </div>
              <div style="text-align:center;color:#888;font-size:0.95rem;margin-top:18px;">
                Generated on: ${new Date(salarySlip.generatedAt).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(slipHtml, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      printBackground: true,
      width: '595px', // A4 width in px at 72dpi
      height: '842px', // A4 height in px at 72dpi
      landscape: false,
      pageRanges: '1',
    });
    await browser.close();

    // Send email with PDF attachment
    if (employee.email) {
      await sendSalarySlipEmail(employee.email, employee, salarySlip, salarySlip.month, pdfBuffer);
    }

    res.status(201).json({
      success: true,
      message: "Salary slip generated and emailed successfully",
      data: {
        salarySlip,
        employee: {
          name: employee.name,
          employeeId: employee.employeeId,
          baseSalary: employee.baseSalary,
        },
        monthAdvances: monthAdvances,
      },
    });
  } catch (err) {
    console.error("Error generating salary slip:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const generateEmployeeIdCardPdf = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: "employeeId is required" });
    }

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: employee.employeeId,
      scale: 1.5,
      height: 20,
      includetext: false,
      backgroundcolor: "FFFFFF",
      paddingwidth: 0,
      paddingheight: 0,
      barcolor: "f77f2f",
    });
    const barcodeDataUrl = `data:image/png;base64,${barcodeBuffer.toString("base64")}`;

    const logoPath = path.join(process.cwd(), "client/public/images/jmd_logo.jpeg");
    const logoDataUrl = `data:image/jpeg;base64,${fs.readFileSync(logoPath).toString("base64")}`;

    let photoDataUrl = logoDataUrl;
    if (employee.profileImage?.startsWith("http")) {
      photoDataUrl = employee.profileImage;
    } else if (employee.profileImage) {
      try {
        const photoPath = path.join(process.cwd(), employee.profileImage);
        photoDataUrl = `data:image/jpeg;base64,${fs.readFileSync(photoPath).toString("base64")}`;
      } catch (e) {
        photoDataUrl = logoDataUrl;
      }
    }

    const {
      name = "—",
      role = "—",
      email = "—",
      grade="A",
      mobile = "—",
      address = "—",
      employeeId: empId = "—",
      joiningDate,
      gender = "—",
      emergencyContact = {},
      bloodGroup = "B+",
      validityDate = "—",
    } = employee;

    const joinDate = joiningDate ? new Date(joiningDate).toLocaleDateString() : "—";
    const emergencyName = emergencyContact.name || "—";
    const emergencyMobile = emergencyContact.mobile || "—";

    const companyName = "JMD Stitching";
    const companyAddress = "108, Infinity Business park, Dombivali(E), Thane - 421203";
    const companyEmail = "info@jmdstitching.com";

    const html = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin:0;padding:0;font-family:'Inter','Roboto','Poppins',sans-serif;width:210mm;height:297mm;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">
        <div style="display:flex;flex-direction:row;align-items:center;justify-content:center;padding:15mm;gap:15mm;width:100%;height:100%;box-sizing:border-box;">
    
          <!-- FRONT SIDE -->
          <div style="width:85mm;height:125mm;background:linear-gradient(135deg,#ffffff 0%,#fefefe 100%);border-radius:18px;overflow:hidden;position:relative;box-shadow:0 6mm 12mm rgba(255,111,0,0.15),0 3mm 6mm rgba(0,0,0,0.1);display:flex;flex-direction:column;justify-content:space-between;padding:0;transition:all 0.3s ease;">
            <!-- Enhanced Polygon Accent Top -->
            <div style="width:100%;height:28mm;background:linear-gradient(135deg,#ff6f00 0%,#ff8f00 50%,#ffb74d 100%);clip-path:polygon(0 0, 100% 0, 100% 65%, 0 100%);position:absolute;top:0;left:0;box-shadow:0 2mm 4mm rgba(255,111,0,0.25);"></div>
            
            <!-- Decorative Elements -->
            <div style="position:absolute;top:5mm;right:5mm;width:10mm;height:10mm;background:rgba(255,255,255,0.2);border-radius:50%;z-index:1;"></div>
            <div style="position:absolute;top:8mm;right:8mm;width:5mm;height:5mm;background:rgba(255,255,255,0.15);border-radius:50%;z-index:1;"></div>
            <div style="position:absolute;top:3mm;right:15mm;width:3mm;height:3mm;background:rgba(255,255,255,0.1);border-radius:50%;z-index:1;"></div>
            
            <!-- Header with Logo and Company Name -->
            <div style="display:flex;align-items:center;justify-content:center;padding:3mm 5mm;z-index:2;position:relative;">
              <div style="background:rgba(255,255,255,0.95);border-radius:2mm;padding:1.5mm;display:flex;align-items:center;box-shadow:0 2mm 4mm rgba(255,111,0,0.2);backdrop-filter:blur(10px);">
                <img src="${logoDataUrl}" style="width:10mm;height:10mm;border-radius:2mm;margin-right:3mm;" />
                <div style="font-size:8px;font-weight:700;color:#1a1a1a;letter-spacing:0.2px;line-height:1.1;">JMD STITCHING <span style="font-size:6px;color:#ff6f00;">PVT LTD</span></div>
              </div>
            </div>
    
            <!-- Profile Section -->
            <div style="text-align:center;z-index:2;margin-top:0mm;padding:0 5mm;">
              <div style="background:white;border-radius:6mm;padding:2mm;display:inline-block;box-shadow:0 3mm 6mm rgba(255,111,0,0.25);margin-bottom:3mm;">
                <img src="${photoDataUrl}" style="width:24mm;height:24mm;object-fit:cover;border-radius:4mm;border:2px solid #ff6f00;" />
              </div>
              <div style="font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:1mm;letter-spacing:-0.2px;">${name}</div>
              <div style="font-size:9px;color:#ff6f00;font-weight:600;margin-bottom:4mm;text-transform:uppercase;letter-spacing:0.4px;background:rgba(255,111,0,0.1);padding:1mm 3mm;border-radius:3mm;display:inline-block;">${role}</div>
              </div>
              
            <!-- Information Section -->
          <div style="font-size:7px;color:#333;margin-top:2mm;padding:0 4mm;z-index:2;flex-grow:1;">
  ${[
    ['ID', empId],
    ['Phone', mobile],
    ['Email', email, 'font-size:6.5px'],
    ['Grade', grade, 'color:#ff6f00;font-weight:700;background:rgba(255,111,0,0.1);padding:1mm 2mm;border-radius:2mm;'],
    ['Joined', joinDate],
    ['Valid Till', validityDate],
    ['Gender', gender],
    ['Blood Group', bloodGroup, 'color:#ff6f00;font-weight:700;background:rgba(255,111,0,0.1);padding:1mm 2mm;border-radius:2mm;']
  ].map(([label, value, valueStyle = '']) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:1mm 0;border-bottom:1px solid #eee;">
      <span style="font-weight:600;color:#666;text-transform:uppercase;letter-spacing:0.3px;">${label}:</span>
      <span style="${valueStyle}">${value}</span>
    </div>
  `).join('')}
  
  <!-- QR CODE -->
  <div style="text-align:center;margin-top:4mm;">
    <div style="background:white;border-radius:3mm;padding:2mm;display:inline-block;box-shadow:0 2mm 4mm rgba(255,111,0,0.2);">
      <img src="${barcodeDataUrl}" style="width:28mm;height:7mm;border-radius:2mm;" />
                </div>
              </div>
            </div>
    
    
            <!-- Enhanced Bottom Section -->
            <div style="position:absolute;bottom:0;left:0;width:100%;height:18mm;background:linear-gradient(135deg,#ff6f00 0%,#ff8f00 50%,#ffb74d 100%);clip-path:polygon(0 35%, 100% 0, 100% 100%, 0 100%);display:flex;align-items:center;justify-content:center;z-index:1;box-shadow:0 -2mm 4mm rgba(255,111,0,0.25);">
              <div style="font-size:8px;font-weight:700;color:white;text-align:center;margin-top:4mm;letter-spacing:0.3px;text-shadow:0 1mm 2mm rgba(0,0,0,0.3);line-height:1.2;">Excellence in Every Stitch<br><span style="font-size:6px;opacity:0.9;">Quality • Innovation • Trust</span></div>
            </div>
          </div>
    
          <!-- BACK SIDE -->
          <div style="width:85mm;height:125mm;background:linear-gradient(135deg,#ffffff 0%,#fefefe 100%);border-radius:18px;overflow:hidden;position:relative;box-shadow:0 6mm 12mm rgba(255,111,0,0.15),0 3mm 6mm rgba(0,0,0,0.1);padding:0;display:flex;flex-direction:column;justify-content:space-between;transition:all 0.3s ease;">
            <!-- Enhanced Polygon Accent Top -->
            <div style="width:100%;height:28mm;background:linear-gradient(135deg,#ff6f00 0%,#ff8f00 50%,#ffb74d 100%);clip-path:polygon(0 0, 100% 0, 100% 65%, 0 100%);position:absolute;top:0;left:0;box-shadow:0 2mm 4mm rgba(255,111,0,0.25);"></div>
    
            <!-- Decorative Elements -->
            <div style="position:absolute;top:5mm;right:5mm;width:10mm;height:10mm;background:rgba(255,255,255,0.2);border-radius:50%;z-index:1;"></div>
            <div style="position:absolute;top:8mm;right:8mm;width:5mm;height:5mm;background:rgba(255,255,255,0.15);border-radius:50%;z-index:1;"></div>
            <div style="position:absolute;top:3mm;right:15mm;width:3mm;height:3mm;background:rgba(255,255,255,0.1);border-radius:50%;z-index:1;"></div>
    
            <!-- Company Header -->
            <div style="z-index:2;text-align:center;margin-top:8mm;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:0 5mm;">
              <div style="background:white;border-radius:4mm;padding:2mm;display:inline-block;box-shadow:0 2mm 4mm rgba(255,111,0,0.2);margin-bottom:3mm;">
                <img src="${logoDataUrl}" style="width:16mm;height:16mm;border-radius:3mm;" />
              </div>
              <div style="font-size:12px;font-weight:700;color:#1a1a1a;text-align:center;margin-bottom:1mm;letter-spacing:-0.2px;">JMD STITCHING</div>
              <div style="font-size:9px;font-weight:600;color:#ff6f00;text-align:center;margin-bottom:4mm;letter-spacing:0.3px;">PVT LTD</div>
              
              <!-- Company Information -->
              <div style="background:rgba(255,111,0,0.05);border-radius:4mm;padding:3mm;margin-bottom:3mm;border:1px solid rgba(255,111,0,0.1);">
                <div style="font-size:7px;color:#555;margin-bottom:1mm;line-height:1.3;"><span style="font-weight:600;color:#ff6f00;">Address:</span> ${companyAddress}</div>
                <div style="font-size:7px;color:#555;margin-bottom:1mm;line-height:1.3;"><span style="font-weight:600;color:#ff6f00;">Email:</span> ${companyEmail}</div>
                <div style="font-size:7px;color:#555;line-height:1.3;"><span style="font-weight:600;color:#ff6f00;">Customer Care:</span> 9082150556</div>
              </div>
              
              <!-- Employee Details -->
              <div style="background:rgba(255,111,0,0.05);border-radius:4mm;padding:3mm;margin-bottom:3mm;border:1px solid rgba(255,111,0,0.1);width:100%;box-sizing:border-box;">
                <div style="font-size:8px;color:#ff6f00;font-weight:700;margin-bottom:2mm;text-transform:uppercase;letter-spacing:0.3px;text-align:center;">Employee Details</div>
                <div style="font-size:7px;color:#555;margin-bottom:1mm;line-height:1.3;"><span style="font-weight:600;color:#333;">Address:</span> ${address}</div>
                <div style="font-size:7px;color:#555;line-height:1.3;"><span style="font-weight:600;color:#333;">Emergency Contact:</span> ${emergencyName} (${emergencyMobile})</div>
              </div>
              
              <!-- Terms & Conditions -->
              <div style="width:100%;text-align:center;">
                <div style="font-size:8px;color:#ff6f00;font-weight:700;margin-bottom:2mm;text-transform:uppercase;letter-spacing:0.3px;">Terms & Conditions</div>
                <ul style="font-size:6px;color:#555;line-height:1.2;padding-left:3mm;margin:0;text-align:left;">
                  <li style="margin-bottom:1mm;">ID card must be visible during work hours</li>
                  <li style="margin-bottom:1mm;">Report lost/damaged cards to HR immediately</li>
                  <li style="margin-bottom:1mm;">Card remains company property</li>
                  <li style="margin-bottom:1mm;">Return upon resignation/termination</li>
                  <li style="margin-bottom:1mm;">If found, return to company address</li>
              </ul>
              </div>
            </div>
            
            <div style="text-align:center;font-size:5px;color:#999;margin-bottom:20mm;font-weight:400;">© ${new Date().getFullYear()} JMD Stitching PVT LTD. All rights reserved.</div>
            
            <!-- Enhanced Bottom Section -->
            <div style="position:absolute;bottom:0;left:0;width:100%;height:18mm;background:linear-gradient(135deg,#ff6f00 0%,#ff8f00 50%,#ffb74d 100%);clip-path:polygon(0 35%, 100% 0, 100% 100%, 0 100%);display:flex;align-items:center;justify-content:center;z-index:1;box-shadow:0 -2mm 4mm rgba(255,111,0,0.25);">
              <div style="font-size:8px;font-weight:700;color:white;text-align:center;margin-top:4mm;letter-spacing:0.3px;text-shadow:0 1mm 2mm rgba(0,0,0,0.3);line-height:1.2;">Excellence in Every Stitch<br><span style="font-size:6px;opacity:0.9;">Quality • Innovation • Trust</span></div>
            </div>
          </div>
        </div>
      </body>
    </html>`;

    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      printBackground: true,
      width: '210mm',
      height: '297mm', 
      landscape: false,
      pageRanges: '1',
    });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=JMD-Employee-ID-${employee.employeeId}.pdf`,
    });
    res.end(pdfBuffer);
  } catch (err) {
    console.error("Error generating employee ID card PDF:", err);
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(`<html><body><div style='color:red;font-size:18px;padding:40px;text-align:center;'>Failed to generate ID Card PDF</div></body></html>`, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      printBackground: true,
      width: "210mm",
      height: "297mm",
      landscape: false,
      pageRanges: "1",
    });
    await browser.close();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename=JMD-Employee-ID-ERROR.pdf` });
    res.end(pdfBuffer);
  }
};

// Send Salary Slip Email
export const sendSalarySlipEmailController = async (req, res) => {
  try {
    const { employeeId, month, email } = req.body;

    if (!employeeId || !month || !email) {
      return res.status(400).json({
        success: false,
        message: "Employee ID, month, and email are required.",
      });
    }

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Find salary slip for the specified month
    const salarySlip = employee.salarySlips.find(slip => slip.monthKey === month);
    if (!salarySlip) {
      return res.status(404).json({
        success: false,
        message: "Salary slip not found for this month",
      });
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "Email service not configured. Please contact administrator.",
      });
    }

    // Generate the professional PDF buffer using Puppeteer
    const pdfBuffer = await generateSalarySlipPDF(employee, salarySlip);

    // Send email with the professional PDF attached
    await sendSalarySlipEmail(email, employee, salarySlip, month, pdfBuffer);

    res.status(200).json({
      success: true,
      message: "Salary slip email sent successfully",
      data: {
        email,
        month,
        employeeName: employee.name,
      },
    });
  } catch (err) {
    console.error("Error sending salary slip email:", err);
    
    // Provide more specific error messages
    let errorMessage = "Failed to send email";
    
    if (err.message.includes("Email credentials not configured")) {
      errorMessage = "Email service not configured. Please contact administrator.";
    } else if (err.message.includes("Email service not available")) {
      errorMessage = "Email service temporarily unavailable. Please try again later.";
    } else if (err.message.includes("Invalid login")) {
      errorMessage = "Email authentication failed. Please check email configuration.";
    } else if (err.message.includes("Missing credentials")) {
      errorMessage = "Email credentials are missing or invalid. Please contact administrator.";
    } else if (err.message.includes("Authentication failed")) {
      errorMessage = "Email authentication failed. Please check email configuration.";
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

export const employeeLogin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email/Mobile and password are required" });
    }

    // Find employee by email or mobile
    const employee = await Employee.findOne({
      $or: [
        { email: emailOrMobile },
        { mobile: emailOrMobile }
      ]
    });

    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if employee is active
    if (employee.status !== "active") {
      return res
        .status(400)
        .json({ success: false, message: "Account is inactive. Please contact administrator." });
    }

    // Verify password
    const isPasswordMatched = await bcrypt.compare(password, employee.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token for employee
    const token = jwt.sign(
      { 
        employeeId: employee._id, 
        role: employee.role,
        employeeId: employee.employeeId,
        name: employee.name 
      },
      process.env.SECRETKEY,
      {
        expiresIn: "1d",
      }
    );

    // Set cookie and send response
    return res
      .status(200)
      .cookie("employeeToken", token, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
        secure: true
      })
      .json({
        success: true,
        message: `Welcome back ${employee.name}`,
        employee: {
          _id: employee._id,
          name: employee.name,
          email: employee.email,
          mobile: employee.mobile,
          role: employee.role,
          employeeId: employee.employeeId,
          profileImage: employee.profileImage,
          baseSalary: employee.baseSalary,
          joiningDate: employee.joiningDate,
          status: employee.status
        },
        token,
      });
  } catch (error) {
    console.log("Employee login error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

export const getEmployeeProfile = async (req, res) => {
  try {
    const { employeeId } = req.employee;
    
    const employee = await Employee.findOne({ employeeId }).select("-password");
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Employee profile fetched successfully",
      employee,
    });
  } catch (err) {
    console.error("Error fetching employee profile:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

export const getEmployeeSalarySlips = async (req, res) => {
  try {
    const { employeeId } = req.employee;
    
    const employee = await Employee.findOne({ employeeId }).select("salarySlips advancePayments baseSalary name employeeId");
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Salary slips fetched successfully",
      salarySlips: employee.salarySlips || [],
      advancePayments: employee.advancePayments || [],
      baseSalary: employee.baseSalary,
      employeeName: employee.name,
      employeeId: employee.employeeId
    });
  } catch (err) {
    console.error("Error fetching employee salary slips:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

export const downloadEmployeeSalarySlip = async (req, res) => {
  try {
    const { employeeId } = req.employee;
    const { month } = req.body;
    
    if (!month) {
      return res.status(400).json({ success: false, message: "Month is required" });
    }
    
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    
    // Find the salary slip for the specified month
    const salarySlip = employee.salarySlips.find(slip => slip.monthKey === month);
    if (!salarySlip) {
      return res.status(404).json({ success: false, message: "Salary slip not found for this month" });
    }
    
    // Generate PDF for the salary slip
    const pdfBuffer = await generateSalarySlipPDF(employee, salarySlip);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="salary-slip-${employee.name}-${month}.pdf"`);
    res.send(pdfBuffer);
    
  } catch (err) {
    console.error("Error downloading salary slip:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

// Helper function to generate salary slip PDF
const generateSalarySlipPDF = async (employee, salarySlip) => {
  // 1. Load your HTML template (inline for now, you can move to a separate file)
  let html = `
  <div style="padding:40px; font-family:Arial, sans-serif; color:#222;">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <img src="https://dummyimage.com/200x60/222/fff&text=COMPANY+LOGO" style="height:60px;">
      <div style="text-align:right;">
        <h2 style="margin:0;">Your Company Name Pvt. Ltd.</h2>
        <div>Address line 1<br>City, State, ZIP<br>Phone | Email</div>
      </div>
    </div>
    <hr style="margin:30px 0;">
    <h1 style="text-align:center; letter-spacing:2px;">Salary Slip</h1>
    <table style="width:100%; margin-bottom:20px;">
      <tr>
        <td><b>Employee Name:</b> ${employee.name}</td>
        <td><b>Employee ID:</b> ${employee.employeeId}</td>
      </tr>
      <tr>
        <td><b>Designation:</b> ${employee.designation || ''}</td>
        <td><b>Pay Period:</b> ${salarySlip.monthKey}</td>
      </tr>
    </table>
    <table style="width:100%; border-collapse:collapse; margin-bottom:30px;">
      <tr style="background:#f5f5f5;">
        <th style="padding:8px; border:1px solid #ddd;">Earnings</th>
        <th style="padding:8px; border:1px solid #ddd;">Amount</th>
        <th style="padding:8px; border:1px solid #ddd;">Deductions</th>
        <th style="padding:8px; border:1px solid #ddd;">Amount</th>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">Basic Salary</td>
        <td style="padding:8px; border:1px solid #ddd;">₹${salarySlip.basicSalary?.toLocaleString('en-IN', {minimumFractionDigits:2}) || '0.00'}</td>
        <td style="padding:8px; border:1px solid #ddd;">Advance</td>
        <td style="padding:8px; border:1px solid #ddd;">₹${salarySlip.advance?.toLocaleString('en-IN', {minimumFractionDigits:2}) || '0.00'}</td>
      </tr>
      <tr style="font-weight:bold;">
        <td style="padding:8px; border:1px solid #ddd;">Net Payable</td>
        <td style="padding:8px; border:1px solid #ddd;">₹${salarySlip.netPay?.toLocaleString('en-IN', {minimumFractionDigits:2}) || '0.00'}</td>
        <td colspan="2"></td>
      </tr>
    </table>
    <div style="text-align:right; margin-top:40px;">
      <div>Authorized Signature</div>
      <img src="https://dummyimage.com/120x40/aaa/fff&text=SIGNATURE" style="height:40px;">
    </div>
    <hr style="margin:30px 0;">
    <div style="font-size:12px; color:#888; text-align:center;">
      This is a computer-generated document. No signature required.
    </div>
  </div>
  `;

  // 2. Launch Puppeteer and generate PDF
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return pdfBuffer;
};



