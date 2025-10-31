import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  gst: {
    type: String,
    default: "",
  },
  pan: {
    type: String,
    default: "",
  },
  cin: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  qrCodeImage: {
    type: String,
    default: "",
    // Payment QR or scanner image URL
  },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    ifsc: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
}, {
  timestamps: true,
});

export default mongoose.model("Branch", branchSchema); 