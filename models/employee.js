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
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: String,
    aadhaarNumber: String,
    aadhaarImage: String, // URL for Aadhaar card image
    aadhaarPublicId: String, // Cloudinary public ID for deletion
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    grade: {
      type: String,
      enum: ["A", "B", "C", "D"],
    },
    dob: Date,
    baseSalary: {
      type: Number,
      default: 0,
    },
    validityDate: {
      type: Date,
      default: function() {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        return date;
      },
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },
    
    role: {
      type: String,
      enum: ["tailor", "manager", "biller", "director", "admin", "other"],
      required: true,
    },

    designation: String, 

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
    baseSalary: {
      type: Number,
      required: true,
      default: 15000,
    },
    advancePayments: [advanceSchema],
    salarySlips: [salarySlipSchema],

    profileImage: String, 
    documents: [
      {
        name: String,  
        url: String,  
      },
    ],

    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifsc: String,
    },
    emergencyContact: {
      name: String,
      mobile: String,
    },

    barcode: String,
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Employee", employeeSchema);
