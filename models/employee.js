import mongoose from "mongoose";

// Schema for advance payments
const advanceSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  reason: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

// Schema for monthly salary slips
const salarySlipSchema = new mongoose.Schema({
  month: {
    type: String, // e.g., "July 2025"
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  advancesDeducted: {
    type: Number,
    default: 0,
  },
  finalPayable: {
    type: Number,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  notes: String,
});

// Main Employee Schema
const employeeSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: String,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: String,
    aadhaarNumber: String,

    // Employment Info
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["tailor", "manager", "biller", "director", "admin", "other"],
      required: true,
    },
    designation: String, // e.g., "Senior Tailor", "Account Manager"
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // Payroll Info
    advancePayments: [advanceSchema],
    salarySlips: [salarySlipSchema],

    // Profile Image & Documents
    profileImage: String, // URL or filename
    documents: [
      {
        name: String, // e.g., "Aadhaar Card", "PAN Card"
        url: String,  // file path or public URL
      },
    ],

    // Banking Info
    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifsc: String,
    },

    // Emergency Contact
    emergencyContact: {
      name: String,
      mobile: String,
    },

    barcode: String,
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.model("Employee", employeeSchema);
