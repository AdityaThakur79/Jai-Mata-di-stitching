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
  monthKey: {
    type: String, // e.g., "2025-07"
    required: true,
  },
  month: {
    type: String, // e.g., "July 2025"
    required: true,
  },
  year: {
    type: Number, // e.g., 2025
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
  advances: [advanceSchema], // Individual advances for this month
  totalAdvances: {
    type: Number,
    default: 0,
  },
  baseSalary: {
    type: Number,
    default: 0,
  },
  netPay: {
    type: Number,
    default: 0,
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
      enum: [
        "chairman",
        "ceo",
        "founder",
        "director",
        "sub director",
        "manager",
        "fitter",
        "sales manager",
        "sales team leader",
        "sales person",
        "branch manager",
        "branch sub manager",
        "branch fitter",
        "master",
        "tailor",
        "peon",
        "handwork designer",
        "handwork person",
        "social media",
        "technical team",
        "packing team leader",
        "packing employee"
      ],
      required: true,
    },

    // Additional roles the employee can perform besides the primary role
    secondaryRoles: {
      type: [String],
      enum: [
        "chairman",
        "ceo",
        "founder",
        "director",
        "sub director",
        "manager",
        "fitter",
        "sales manager",
        "sales team leader",
        "sales person",
        "branch manager",
        "branch sub manager",
        "branch fitter",
        "master",
        "tailor",
        "peon",
        "handwork designer",
        "handwork person",
        "social media",
        "technical team",
        "packing team leader",
        "packing employee"
      ],
      default: [],
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
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Employee", employeeSchema);
