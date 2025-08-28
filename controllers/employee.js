import Employee from "../models/employee.js";
import moment from "moment";
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
      branchId, // Accept branchId directly from body
    } = req.body;

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: "Branch is required.",
      });
    }
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const validityDate = new Date();
    validityDate.setFullYear(validityDate.getFullYear() + 1);
    let profileImage = "";
    let aadhaarImage = "";
    let aadhaarPublicId = "";
    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
      profileImage = req.files.profileImage[0].path;
    }
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
      branchId,
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
    let { page, limit, search, status, branchId } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    if (branchId) {
      query.branchId = branchId;
    }
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
    }
    const employees = await Employee.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Employee.countDocuments(query);
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
      role,
      joiningDate,
      bloodGroup,
      grade,
      dob,
      baseSalary,
      bankDetails,
      emergencyContact,
      branchId,
      status,
      existingAadhaarPublicId,
    } = req.body;
    
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    
    // Update fields - use more specific checks for fields that can be empty
    if (branchId !== undefined) employee.branchId = branchId;
    if (name !== undefined) employee.name = name;
    if (mobile !== undefined) employee.mobile = mobile;
    if (email !== undefined) employee.email = email;
    if (gender !== undefined) employee.gender = gender;
    if (address !== undefined) employee.address = address;
    if (aadhaarNumber !== undefined) employee.aadhaarNumber = aadhaarNumber;
    if (role !== undefined) employee.role = role;
    if (joiningDate !== undefined) employee.joiningDate = joiningDate;
    if (bloodGroup !== undefined) employee.bloodGroup = bloodGroup;
    if (grade !== undefined) employee.grade = grade;
    if (dob !== undefined) employee.dob = dob;
    if (baseSalary !== undefined && baseSalary !== "") employee.baseSalary = parseFloat(baseSalary);
    if (status !== undefined) employee.status = status;
    
    // Handle password update (only if provided and not empty)
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      employee.password = await bcrypt.hash(password, salt);
    }
    
    // Handle bank details
    if (bankDetails) {
      const parsedBankDetails = typeof bankDetails === "string" ? JSON.parse(bankDetails) : bankDetails;
      // Only update if the parsed data has meaningful content
      if (parsedBankDetails && (parsedBankDetails.bankName || parsedBankDetails.accountNumber || parsedBankDetails.ifsc)) {
        employee.bankDetails = parsedBankDetails;
      } else {
        // Clear bank details if all fields are empty
        employee.bankDetails = { bankName: "", accountNumber: "", ifsc: "" };
      }
    }
    
    // Handle emergency contact
    if (emergencyContact) {
      const parsedEmergencyContact = typeof emergencyContact === "string" ? JSON.parse(emergencyContact) : emergencyContact;
      // Only update if the parsed data has meaningful content
      if (parsedEmergencyContact && (parsedEmergencyContact.name || parsedEmergencyContact.mobile)) {
        employee.emergencyContact = parsedEmergencyContact;
      } else {
        // Clear emergency contact if all fields are empty
        employee.emergencyContact = { name: "", mobile: "" };
      }
    }
    
    // Handle profile image upload
    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
      employee.profileImage = req.files.profileImage[0].path;
    }
    
    // Handle Aadhaar image upload
    if (req.files && req.files.aadhaarImage && req.files.aadhaarImage[0]) {
      // If there's an existing Aadhaar image, we might want to delete it
      if (existingAadhaarPublicId && employee.aadhaarPublicId) {
        // You can add logic here to delete the old image file if needed
        // For now, just update the references
      }
      employee.aadhaarImage = req.files.aadhaarImage[0].path;
      employee.aadhaarPublicId = req.files.aadhaarImage[0].filename;
    }
    
    await employee.save();
    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findOneAndDelete({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    res.status(200).json({ success: true, message: "Employee deleted successfully" });
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
      .select("name employeeId baseSalary advancePayments salarySlips profileImage")
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
          profileImage: employee.profileImage,
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
    const { employeeId, month, year } = req.body;
    if (!employeeId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Employee ID, month, and year are required",
      });
    }

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Calculate salary based on base salary and any deductions
    const baseSalary = employee.baseSalary || 0;
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    // Check if salary slip already exists for this month
    const existingSlip = employee.salarySlips.find(slip => slip.monthKey === monthKey);
    if (existingSlip) {
      return res.status(400).json({
        success: false,
        message: "Salary slip already generated for this month",
      });
    }

    // Get advances for this month
    const monthAdvances = employee.advancePayments.filter(advance => {
      const advanceDate = new Date(advance.date);
      return advanceDate.getMonth() === parseInt(month) - 1 && advanceDate.getFullYear() === parseInt(year);
    });

    const totalAdvances = monthAdvances.reduce((sum, advance) => sum + advance.amount, 0);
    const netPay = Math.max(0, baseSalary - totalAdvances);

    // Create salary slip
    const salarySlip = {
      monthKey,
      month: new Date(year, month).toLocaleDateString('en-US', { month: 'long' }), // Store month name
      year,
      basicSalary: baseSalary,        // Required field by Employee model
      finalPayable: netPay,           // Required field by Employee model
      baseSalary,                     // Keep for backward compatibility
      advances: monthAdvances,
      totalAdvances,
      netPay,                         // Keep for backward compatibility
      advancesDeducted: totalAdvances, // Required by email template
      notes: `Salary slip generated for ${new Date(year, month).toLocaleDateString('en-US', { month: 'long' })} ${year}. Total advances: ₹${totalAdvances.toLocaleString('en-IN')}.`, // Required by email template
      generatedAt: new Date(),
    };

    // Add to employee's salary slips
    employee.salarySlips.push(salarySlip);
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Salary slip generated successfully",
      salarySlip,
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
        name: employee.name,
        branchId: employee.branchId,
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
          status: employee.status,
          branchId: employee.branchId,
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

// export const getEmployeeSalarySlips = async (req, res) => {
//   try {
//     const { employeeId } = req.employee;
    
//     const employee = await Employee.findOne({ employeeId }).select("salarySlips advancePayments baseSalary name employeeId");
//     if (!employee) {
//       return res.status(404).json({ success: false, message: "Employee not found" });
//     }
    
//     res.status(200).json({
//       success: true,
//       message: "Salary slips fetched successfully",
//       salarySlips: employee.salarySlips || [],
//       advancePayments: employee.advancePayments || [],
//       baseSalary: employee.baseSalary,
//       employeeName: employee.name,
//       employeeId: employee.employeeId
//     });
//   } catch (err) {
//     console.error("Error fetching employee salary slips:", err);
//     res.status(500).json({ success: false, message: "Internal server error", error: err.message });
//   }
// };

// export const downloadEmployeeSalarySlip = async (req, res) => {
//   try {
//     const { employeeId } = req.employee;
//     const { month } = req.body;
    
//     if (!month) {
//       return res.status(400).json({ success: false, message: "Month is required" });
//     }
    
//     const employee = await Employee.findOne({ employeeId });
//     if (!employee) {
//       return res.status(404).json({ success: false, message: "Employee not found" });
//     }
    
//     // Find the salary slip for the specified month
//     const salarySlip = employee.salarySlips.find(slip => slip.monthKey === month);
//     if (!salarySlip) {
//       return res.status(404).json({ success: false, message: "Salary slip not found for this month" });
//     }
    
//     // Generate PDF for the salary slip
//     const pdfBuffer = await generateSalarySlipPDF(employee, salarySlip);
    
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="salary-slip-${employee.name}-${month}.pdf"`);
//     res.send(pdfBuffer);
    
//   } catch (err) {
//     console.error("Error downloading salary slip:", err);
//     res.status(500).json({ success: false, message: "Internal server error", error: err.message });
//   }
// };

// Helper function to generate salary slip PDF
// const generateSalarySlipPDF = async (employee, salarySlip) => {
//   // 1. Load your HTML template (inline for now, you can move to a separate file)
//   let html = `
//   <div style="padding:40px; font-family:Arial, sans-serif; color:#222;">
//     <div style="display:flex; justify-content:space-between; align-items:center;">
//       <img src="https://dummyimage.com/200x60/222/fff&text=COMPANY+LOGO" style="height:60px;">
//       <div style="text-align:right;">
//         <h2 style="margin:0;">Your Company Name Pvt. Ltd.</h2>
//         <div>Address line 1<br>City, State, ZIP<br>Phone | Email</div>
//       </div>
//     </div>
//     <hr style="margin:30px 0;">
//     <h1 style="text-align:center; letter-spacing:2px;">Salary Slip</h1>
//     <table style="width:100%; margin-bottom:20px;">
//       <tr>
//         <td><b>Employee Name:</b> ${employee.name}</td>
//         <td><b>Employee ID:</b> ${employee.employeeId}</td>
//       </tr>
//       <tr>
//         <td><b>Designation:</b> ${employee.designation || ''}</td>
//         <td><b>Pay Period:</b> ${salarySlip.monthKey}</td>
//       </tr>
//     </table>
//     <table style="width:100%; border-collapse:collapse; margin-bottom:30px;">
//       <tr style="background:#f5f5f5;">
//         <th style="padding:8px; border:1px solid #ddd;">Earnings</th>
//         <th style="padding:8px; border:1px solid #ddd;">Amount</th>
//         <th style="padding:8px; border:1px solid #ddd;">Deductions</th>
//         <th style="padding:8px; border:1px solid #ddd;">Amount</th>
//       </tr>
//       <tr>
//         <td style="padding:8px; border:1px solid #ddd;">Basic Salary</td>
//         <td style="padding:8px; border:1px solid #ddd;">₹${salarySlip.basicSalary?.toLocaleString('en-IN', {minimumFractionDigits:2}) || '0.00'}</td>
//         <td style="padding:8px; border:1px solid #ddd;">Advances</td>
//         <td style="padding:8px; border:1px solid #ddd;">₹${salarySlip.totalAdvances?.toLocaleString('en-IN', {minimumFractionDigits:2}) || '0.00'}</td>
//       </tr>
//       <tr style="font-weight:bold;">
//         <td style="padding:8px; border:1px solid #ddd;">Final Payable</td>
//         <td style="padding:8px; border:1px solid #ddd;">₹${salarySlip.finalPayable?.toLocaleString('en-IN', {minimumFractionDigits:2}) || '0.00'}</td>
//         <td colspan="2"></td>
//       </tr>
//     </table>
//     <div style="text-align:right; margin-top:40px;">
//       <div>Authorized Signature</div>
//       <img src="https://dummyimage.com/120x40/aaa/fff&text=SIGNATURE" style="height:40px;">
//     </div>
//     <hr style="margin:30px 0;">
//     <div style="font-size:12px; color:#888; text-align:center;">
//       This is a computer-generated document. No signature required.
//     </div>
//   </div>
//   `;

//   // 2. Launch Puppeteer and generate PDF
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.setContent(html, { waitUntil: 'networkidle0' });
//   const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
//   await browser.close();

//   return pdfBuffer;
// };

export const getFilteredEmployeeDetails = async (req, res) => {
  try {
    const { 
      employeeId, 
      year, 
      month = "all", 
      search = "", 
      slipFilter = "all", 
      advanceFilter = "all" 
    } = req.body;

    if (!employeeId || !year) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and year are required",
      });
    }

    // Find the employee
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Get joining month and year
    const joiningDate = new Date(employee.joiningDate);
    const joiningYear = joiningDate.getFullYear();
    const joiningMonth = joiningDate.getMonth();

    // Check if the requested year is before the joining year
    if (year < joiningYear) {
      return res.status(200).json({
        success: true,
        message: "Employee not yet joined in this year",
        monthlyData: [],
        employee: {
          name: employee.name,
          employeeId: employee.employeeId,
          joiningDate: employee.joiningDate,
        }
      });
    }

    // Initialize months for the requested year
    let startMonth = 0;
    let endMonth = 11;
    
    if (year === joiningYear) {
      startMonth = joiningMonth;
    }

    const monthlyData = [];
    
    for (let i = startMonth; i <= endMonth; i++) {
      const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
      const monthName = new Date(year, i).toLocaleDateString('en-US', { month: 'long' });
      
      // Get advances for this month
      const monthAdvances = employee.advancePayments?.filter(advance => {
        const advanceDate = new Date(advance.date);
        return advanceDate.getMonth() === i && advanceDate.getFullYear() === year;
      }) || [];
      
      const monthTotalAdvance = monthAdvances.reduce((sum, advance) => sum + advance.amount, 0);
      const monthRemaining = employee.baseSalary - monthTotalAdvance;
      
      // Find salary slip for this month
      const salarySlip = employee.salarySlips?.find(slip => {
        const slipDate = new Date(slip.generatedAt);
        return slipDate.getMonth() === i && slipDate.getFullYear() === year;
      });
      
      monthlyData.push({
        month: monthName,
        monthIndex: i,
        monthKey: monthKey,
        year: year,
        baseSalary: employee.baseSalary || 0,
        advances: monthAdvances,
        totalAdvance: monthTotalAdvance,
        remainingAmount: monthRemaining,
        salarySlip: salarySlip,
        advanceCount: monthAdvances.length,
        salarySlipGenerated: !!salarySlip,
        isJoiningMonth: (year === joiningYear && i === joiningMonth)
      });
    }

    // Apply filters
    let filteredData = monthlyData;

    // Month filter
    if (month !== "all") {
      filteredData = filteredData.filter(m => m.monthIndex === parseInt(month));
    }

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      filteredData = filteredData.filter(m => {
        // Search in month name
        if (m.month.toLowerCase().includes(query)) return true;
        
        // Search in advances reason
        if (m.advances.some(advance => 
          advance.reason.toLowerCase().includes(query)
        )) return true;
        
        // Search in employee name and ID
        if (employee.name.toLowerCase().includes(query)) return true;
        if (employee.employeeId.toLowerCase().includes(query)) return true;
        
        return false;
      });
    }

    // Slip filter
    if (slipFilter === "generated") {
      filteredData = filteredData.filter(m => m.salarySlipGenerated);
    } else if (slipFilter === "not-generated") {
      filteredData = filteredData.filter(m => !m.salarySlipGenerated);
    }

    // Advance filter
    if (advanceFilter === "with-advance") {
      filteredData = filteredData.filter(m => m.advanceCount > 0);
    } else if (advanceFilter === "no-advance") {
      filteredData = filteredData.filter(m => m.advanceCount === 0);
    }

    // Sort by month index
    filteredData.sort((a, b) => a.monthIndex - b.monthIndex);

    res.status(200).json({
      success: true,
      message: "Filtered employee details fetched successfully",
      monthlyData: filteredData,
      employee: {
        name: employee.name,
        employeeId: employee.employeeId,
        joiningDate: employee.joiningDate,
        baseSalary: employee.baseSalary,
      }
    });

  } catch (err) {
    console.error("Error fetching filtered employee details:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};



