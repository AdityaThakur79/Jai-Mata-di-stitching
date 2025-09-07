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
    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });
    const existingSlip = employee.salarySlips.find(slip => 
      slip.monthKey === monthKey || 
      slip.month === `${monthName} ${year}` ||
      (slip.month === monthName && slip.year === parseInt(year))
    );
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
      month: `${monthName} ${year}`, // Store month name with year
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
    console.log("Looking for salary slip with monthKey:", month);
    console.log("Available salary slips:", employee.salarySlips.map(slip => ({ 
      monthKey: slip.monthKey, 
      month: slip.month, 
      year: slip.year 
    })));
    
    // Fix existing salary slips that might be missing monthKey and year
    let needsUpdate = false;
    employee.salarySlips.forEach(slip => {
      if (!slip.monthKey || !slip.year) {
        // Extract year and month from the month string (e.g., "September 2025")
        const monthMatch = slip.month?.match(/(\w+)\s+(\d{4})/);
        if (monthMatch) {
          const [, monthName, year] = monthMatch;
          const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
          slip.monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
          slip.year = parseInt(year);
          needsUpdate = true;
        }
      }
    });
    
    if (needsUpdate) {
      await employee.save();
      console.log("Updated salary slips with missing monthKey/year fields");
    }
    
    // The frontend sends monthKey directly (e.g., "2025-09")
    const salarySlip = employee.salarySlips.find(slip => slip.monthKey === month);
    
    if (!salarySlip) {
      return res.status(404).json({
        success: false,
        message: "Salary slip not found for this month",
        debug: {
          requestedMonth: month,
          availableSlips: employee.salarySlips.map(slip => ({ 
            monthKey: slip.monthKey, 
            month: slip.month, 
            year: slip.year 
          }))
        }
      });
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "Email service not configured. Please contact administrator.",
      });
    }

    // Generate PDF using @react-pdf/renderer
    let pdfBuffer = null;
    
    try {
      const { pdf, Document, Page, Text, View, StyleSheet, Image } = await import('@react-pdf/renderer');
      const fs = await import('fs');
      const path = await import('path');
      
      // Load company logo
      let logoDataUrl = null;
      try {
        const logoPath = path.join(process.cwd(), 'client', 'public', 'images', 'jmd_logo.jpeg');
        if (fs.existsSync(logoPath)) {
          const logoBuffer = fs.readFileSync(logoPath);
          logoDataUrl = `data:image/jpeg;base64,${logoBuffer.toString('base64')}`;
        }
      } catch (logoError) {
        console.warn('Error loading logo for email:', logoError);
      }

      // Create styles for PDF
      const styles = StyleSheet.create({
        page: {
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          padding: 20,
          fontFamily: 'Helvetica',
          fontSize: 10,
        },
        header: {
          alignItems: 'center',
          marginBottom: 20,
          borderBottomWidth: 2,
          paddingBottom: 10,
        },
        logo: {
          width: 60,
          height: 60,
          marginBottom: 10,
        },
        companyName: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#ff6b35',
          marginBottom: 5,
        },
        salarySlipTitle: {
          fontSize: 14,
          color: '#666',
        },
        month: {
          fontSize: 12,
          color: '#ff6b35',
          marginTop: 10,
        },
        section: {
          marginBottom: 15,
        },
        sectionTitle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#ff6b35',
          marginBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#ff6b35',
          paddingBottom: 4,
        },
        row: {
          flexDirection: 'row',
          marginBottom: 5,
        },
        label: {
          flex: 1,
          fontSize: 9,
          color: '#333',
        },
        value: {
          flex: 1,
          fontSize: 9,
          color: '#333',
          textAlign: 'right',
        },
        totalRow: {
          flexDirection: 'row',
          marginTop: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#ff6b35',
        },
        totalLabel: {
          flex: 1,
          fontSize: 11,
          fontWeight: 'bold',
          color: '#ff6b35',
        },
        totalValue: {
          flex: 1,
          fontSize: 11,
          fontWeight: 'bold',
          color: '#ff6b35',
          textAlign: 'right',
        },
      });

      // Create PDF document
      const SalarySlipPDF = () => (
        Document(
          {},
          Page(
            { style: styles.page },
            View({ style: styles.header },
              logoDataUrl && Image({ src: logoDataUrl, style: styles.logo }),
              Text({ style: styles.companyName }, 'JMD STITCHING PVT LTD'),
              Text({ style: styles.salarySlipTitle }, 'SALARY SLIP'),
              Text({ style: styles.month }, month)
            ),
            View({ style: styles.section },
              Text({ style: styles.sectionTitle }, 'Employee Details'),
              View({ style: styles.row },
                Text({ style: styles.label }, 'Name:'),
                Text({ style: styles.value }, employee.name)
              ),
              View({ style: styles.row },
                Text({ style: styles.label }, 'Employee ID:'),
                Text({ style: styles.value }, employee.employeeId)
              ),
              View({ style: styles.row },
                Text({ style: styles.label }, 'Designation:'),
                Text({ style: styles.value }, employee.designation || 'N/A')
              ),
              View({ style: styles.row },
                Text({ style: styles.label }, 'Department:'),
                Text({ style: styles.value }, employee.department || 'N/A')
              )
            ),
            View({ style: styles.section },
              Text({ style: styles.sectionTitle }, 'Salary Details'),
              View({ style: styles.row },
                Text({ style: styles.label }, 'Basic Salary:'),
                Text({ style: styles.value }, `₹${salarySlip.basicSalary?.toLocaleString() || 0}`)
              ),
              View({ style: styles.row },
                Text({ style: styles.label }, 'Advances Deducted:'),
                Text({ style: styles.value }, `₹${salarySlip.advancesDeducted?.toLocaleString() || 0}`)
              ),
              View({ style: styles.totalRow },
                Text({ style: styles.totalLabel }, 'Final Payable:'),
                Text({ style: styles.totalValue }, `₹${salarySlip.finalPayable?.toLocaleString() || 0}`)
              )
            )
          )
        )
      );

      pdfBuffer = await pdf(SalarySlipPDF()).toBuffer();
      console.log('PDF generated successfully for email');
    } catch (error) {
      console.warn('PDF generation failed, sending HTML email only:', error);
      // Continue without PDF - the email will be sent with HTML content only
    }

    // Send email with PDF attachment (if generated) or HTML only
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

export const getEmployeeSalarySlips = async (req, res) => {
  try {
    const { employeeId } = req.employee;
    
    const employee = await Employee.findOne({ employeeId }).select("salarySlips advancePayments baseSalary name employeeId");
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    
    // Remove duplicate salary slips based on month and year
    const uniqueSlips = [];
    const seen = new Set();
    
    employee.salarySlips.forEach(slip => {
      const key = `${slip.month}-${slip.year}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueSlips.push(slip);
      }
    });
    
    // Update the employee document with unique slips if duplicates were found
    if (uniqueSlips.length !== employee.salarySlips.length) {
      employee.salarySlips = uniqueSlips;
      await employee.save();
      console.log(`Removed ${employee.salarySlips.length - uniqueSlips.length} duplicate salary slips for employee ${employeeId}`);
    }
    
    res.status(200).json({
      success: true,
      message: "Salary slips fetched successfully",
      salarySlips: uniqueSlips,
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
    const { employeeId, month, year } = req.body;
    
    console.log("Download request received:", { employeeId, month, year });
    
    if (!employeeId || !month) {
      return res.status(400).json({ 
        success: false, 
        message: "Employee ID and month are required" 
      });
    }
    
    // Extract year from month if not provided (e.g., "2025-08" -> year: 2025)
    let extractedYear = year;
    let extractedMonth = month;
    
    if (!extractedYear && month && month.includes('-')) {
      [extractedYear, extractedMonth] = month.split('-');
    }
    
    if (!extractedYear) {
      return res.status(400).json({ 
        success: false, 
        message: "Year is required or month should be in YYYY-MM format" 
      });
    }
    
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: "Employee not found" 
      });
    }
    
    console.log("Employee found:", employee.employeeId);
    console.log("Available salary slips:", JSON.stringify(employee.salarySlips?.map(slip => ({ monthKey: slip.monthKey, month: slip.month, year: slip.year })), null, 2));
    console.log("Searching for month:", month);
    
    // Find the salary slip for the specified month
    // Try to find by monthKey first, then by month and year
    let salarySlip = employee.salarySlips?.find(slip => slip.monthKey === month);
    
    if (!salarySlip) {
      console.log("MonthKey search failed, trying fallback search...");
      // If monthKey doesn't match, try to find by month and year
      const requestYear = extractedYear;
      const requestMonth = extractedMonth;
      console.log("Parsed request - Year:", requestYear, "Month:", requestMonth);
      
      salarySlip = employee.salarySlips?.find(slip => {
        console.log("Checking slip:", { monthKey: slip.monthKey, month: slip.month, year: slip.year });
        
        // Check if slip has monthKey and it matches
        if (slip.monthKey === month) {
          console.log("Found by monthKey match!");
          return true;
        }
        
        // Check if slip has month and year that match
        if (slip.month && slip.year) {
          // Handle different month formats
          let slipMonthIndex;
          if (typeof slip.month === 'string' && !isNaN(slip.month)) {
            // If month is stored as string number (like '7'), convert to index
            slipMonthIndex = parseInt(slip.month);
          } else if (typeof slip.month === 'number') {
            // If month is stored as number, use as is
            slipMonthIndex = slip.month;
          } else {
            // Try to parse as date
            slipMonthIndex = new Date(slip.year, slip.month - 1).getMonth();
          }
          
          const requestMonthIndex = parseInt(requestMonth) - 1;
          const yearMatch = slip.year === parseInt(requestYear);
          const monthMatch = slipMonthIndex === requestMonthIndex;
          
          console.log("Fallback check - Year match:", yearMatch, "Month match:", monthMatch, 
                     "Slip month index:", slipMonthIndex, "Request month index:", requestMonthIndex,
                     "Slip month type:", typeof slip.month, "Slip month value:", slip.month);
          
          return yearMatch && monthMatch;
        }
        
        // Check if slip has month name that matches the requested month
        if (slip.month && typeof slip.month === 'string') {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          
          const requestMonthIndex = parseInt(requestMonth) - 1;
          const requestMonthName = monthNames[requestMonthIndex];
          
          console.log("Month name check - Request month name:", requestMonthName, "Slip month:", slip.month);
          
          if (slip.month === requestMonthName) {
            console.log("Found by month name match!");
            return true;
          }
        }
        
        console.log("Slip doesn't have month/year data");
        return false;
      });
    }
    
    if (!salarySlip) {
      return res.status(404).json({ 
        success: false, 
        message: `Salary slip not found for month: ${month}. Available salary slips: ${employee.salarySlips?.map(slip => `{monthKey: ${slip.monthKey || 'undefined'}, month: ${slip.month || 'undefined'}, year: ${slip.year || 'undefined'}}`).join(', ') || 'none'}` 
      });
    }
    
    console.log("Salary slip found:", { monthKey: salarySlip.monthKey, month: salarySlip.month, year: salarySlip.year });
    
    // Get advances for this month
    const monthAdvances = employee.advancePayments?.filter(advance => {
      const advanceDate = new Date(advance.date);
      const advanceMonthKey = `${advanceDate.getFullYear()}-${String(advanceDate.getMonth() + 1).padStart(2, '0')}`;
      
      // Try to match by monthKey first
      if (advanceMonthKey === month) return true;
      
      // If monthKey doesn't match, try by year and month
      return advanceDate.getFullYear() === parseInt(extractedYear) && 
             advanceDate.getMonth() === parseInt(extractedMonth) - 1;
    }) || [];

    console.log("Advances found for month:", monthAdvances.length);
    
    // Return the salary slip data for frontend PDF generation
    res.json({
      success: true,
      message: "Salary slip data retrieved successfully",
      data: {
        employee: {
          name: employee.name,
          employeeId: employee.employeeId,
          role: employee.role,
          joiningDate: employee.joiningDate,
          baseSalary: employee.baseSalary,
          mobile: employee.mobile,
          email: employee.email,
          address: employee.address,
          bankDetails: employee.bankDetails,
          emergencyContact: employee.emergencyContact,
        },
        salarySlip: {
          ...salarySlip,
          advances: monthAdvances
        }
      }
    });
    
  } catch (err) {
    console.error("Error retrieving salary slip data:", err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: err.message 
    });
  }
};


// Helper function to generate salary slip HTML
const generateSalarySlipHTML = (employee, salarySlip, month) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const grossEarnings = employee.baseSalary || 0;
  const totalDeductions = salarySlip.advancesDeducted || 0;
  const netSalary = grossEarnings - totalDeductions;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Salary Slip - ${month}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .salary-slip-title { font-size: 18px; color: #666; margin-bottom: 10px; }
        .pay-period { font-size: 14px; background: #f5f5f5; padding: 8px; border-radius: 4px; display: inline-block; }
        .employee-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-section h3 { background: #e9ecef; padding: 8px; margin: 0 0 10px 0; font-size: 14px; }
        .info-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
        .info-label { font-weight: bold; }
        .financial-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .earnings-table, .deductions-table { border: 1px solid #333; }
        .table-header { background: #f8f9fa; font-weight: bold; padding: 8px; border-bottom: 1px solid #333; }
        .table-row { display: flex; border-bottom: 1px solid #ddd; }
        .table-cell { flex: 1; padding: 8px; }
        .table-cell:last-child { text-align: right; }
        .net-salary { background: #e8f5e8; border: 2px solid #28a745; padding: 15px; text-align: center; margin: 20px 0; }
        .net-salary-amount { font-size: 20px; font-weight: bold; color: #28a745; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        .advances-table { margin-bottom: 20px; }
        .advances-table .table-header { background: #f8f9fa; }
        .advances-table .table-row:nth-child(even) { background: #f8f9fa; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">JMD STITCHING PVT LTD</div>
        <div class="salary-slip-title">SALARY SLIP</div>
        <div class="pay-period">Pay Period: ${month}</div>
      </div>

      <div class="employee-info">
        <div>
          <h3>Employee Details</h3>
          <div class="info-row">
            <span class="info-label">Employee ID:</span>
            <span>${employee.employeeId || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span>${employee.name || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Designation:</span>
            <span>${employee.role || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Department:</span>
            <span>Tailoring</span>
          </div>
          <div class="info-row">
            <span class="info-label">Joining Date:</span>
            <span>${employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString('en-IN') : 'N/A'}</span>
          </div>
        </div>
        <div>
          <h3>Contact & Bank Details</h3>
          <div class="info-row">
            <span class="info-label">Mobile:</span>
            <span>${employee.mobile || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span>${employee.email || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Bank Name:</span>
            <span>${employee.bankDetails?.bankName || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Account No:</span>
            <span>${employee.bankDetails?.accountNumber || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">IFSC Code:</span>
            <span>${employee.bankDetails?.ifsc || 'N/A'}</span>
          </div>
        </div>
      </div>

      ${salarySlip.advances && salarySlip.advances.length > 0 ? `
      <div class="advances-table">
        <h3>Advances Taken</h3>
        <div class="table-header">
          <div class="table-cell">Date</div>
          <div class="table-cell">Reason</div>
          <div class="table-cell">Amount (₹)</div>
        </div>
        ${salarySlip.advances.map(advance => `
          <div class="table-row">
            <div class="table-cell">${advance.date ? new Date(advance.date).toLocaleDateString('en-IN') : 'N/A'}</div>
            <div class="table-cell">${advance.reason || 'N/A'}</div>
            <div class="table-cell">${advance.amount ? advance.amount.toFixed(2) : '0.00'}</div>
          </div>
        `).join('')}
        <div class="table-row" style="background: #e9ecef; font-weight: bold;">
          <div class="table-cell">TOTAL ADVANCES</div>
          <div class="table-cell"></div>
          <div class="table-cell">${totalDeductions.toFixed(2)}</div>
        </div>
      </div>
      ` : ''}

      <div class="financial-section">
        <div class="earnings-table">
          <div class="table-header">EARNINGS</div>
          <div class="table-row">
            <div class="table-cell">Basic Salary</div>
            <div class="table-cell">${formatCurrency(employee.baseSalary || 0)}</div>
          </div>
          <div class="table-row">
            <div class="table-cell">House Rent Allowance</div>
            <div class="table-cell">₹0.00</div>
          </div>
          <div class="table-row">
            <div class="table-cell">Medical Allowance</div>
            <div class="table-cell">₹0.00</div>
          </div>
          <div class="table-row">
            <div class="table-cell">Conveyance Allowance</div>
            <div class="table-cell">₹0.00</div>
          </div>
          <div class="table-row" style="background: #e9ecef; font-weight: bold;">
            <div class="table-cell">GROSS EARNINGS</div>
            <div class="table-cell">${formatCurrency(grossEarnings)}</div>
          </div>
        </div>

        <div class="deductions-table">
          <div class="table-header">DEDUCTIONS</div>
          <div class="table-row">
            <div class="table-cell">Provident Fund</div>
            <div class="table-cell">₹0.00</div>
          </div>
          <div class="table-row">
            <div class="table-cell">ESI</div>
            <div class="table-cell">₹0.00</div>
          </div>
          <div class="table-row">
            <div class="table-cell">Professional Tax</div>
            <div class="table-cell">₹0.00</div>
          </div>
          <div class="table-row">
            <div class="table-cell">Advances</div>
            <div class="table-cell">${formatCurrency(salarySlip.advancesDeducted || 0)}</div>
          </div>
          <div class="table-row" style="background: #e9ecef; font-weight: bold;">
            <div class="table-cell">GROSS DEDUCTIONS</div>
            <div class="table-cell">${formatCurrency(totalDeductions)}</div>
          </div>
        </div>
      </div>

      <div class="net-salary">
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">NET SALARY PAYABLE</div>
        <div class="net-salary-amount">${formatCurrency(netSalary)}</div>
      </div>

      <div class="footer">
        <p>* This is a computer-generated salary slip and does not require a signature.</p>
        <p>* Net salary payable is subject to deductions as per Income Tax Law.</p>
        <p>Generated on: ${salarySlip.generatedAt ? new Date(salarySlip.generatedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}</p>
        ${salarySlip.notes ? `<p>Notes: ${salarySlip.notes}</p>` : ''}
      </div>
    </body>
    </html>
  `;
};

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



