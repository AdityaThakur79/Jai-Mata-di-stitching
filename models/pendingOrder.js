import mongoose from "mongoose";

const pendingOrderItemSchema = new mongoose.Schema({
  itemType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItemMaster",
    required: true,
  },
   itemCode: {
    type: String,
    required: true,
    unique: true,  
  },
  fabric: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FabricMaster",
  },
  fabricMeters: {
  type: Number,
  min: 2,
  required: function () {
    return this.fabric != null;
  },
},
  style: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StyleMaster",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  measurement: {
    type: Map,
    of: Number, 
  },
  // orderImage: String,
  // orderImagePublicId: String,
  designNumber: String,
  description: String,
}, { _id: false });


const pendingOrderSchema = new mongoose.Schema({
  tokenNumber: {
    type: String,
    unique: true,
    required: true,
  },

  orderType: {
    type: String,
    enum: ["fabric", "fabric_stitching", "stitching"],
    required: true,
  },

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  items: [pendingOrderItemSchema],

  master: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  salesman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "billed", "expired"],
    default: "pending",
  },

  // Reference to generated invoice
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: {
    type: Date,  
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
}, { timestamps: true });

const PendingOrder = mongoose.model("PendingOrder", pendingOrderSchema);
export default PendingOrder;
