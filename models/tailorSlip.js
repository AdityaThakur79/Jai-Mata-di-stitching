import mongoose from "mongoose";

const tailorSlipSchema = new mongoose.Schema(
  {
    slipNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    pendingOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PendingOrder",
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },
    tokenNumber: {
      type: String,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    customerName: {
      type: String,
      default: "",
    },
    itemCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    itemType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemMaster",
      required: true,
    },
    itemTypeName: {
      type: String,
      default: "",
    },
    style: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StyleMaster",
    },
    styleName: {
      type: String,
      default: "",
    },
    fabric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FabricMaster",
    },
    fabricName: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
    },
    measurement: {
      type: Map,
      of: Number,
    },
    designNumber: String,
    description: String,
    notes: String,
    specialInstructions: String,
    status: {
      type: String,
      enum: ["pending", "printed", "assigned", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    printCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    duplicatePrintCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    printedAt: Date,
    printedByRole: String,
    printedByName: String,
    scannedAt: Date,
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    scannedByName: String,
    barcodeValue: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tailoringRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    earningAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "processing", "paid"],
      default: "unpaid",
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const TailorSlip = mongoose.model("TailorSlip", tailorSlipSchema);

export default TailorSlip;
