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
  min: 0,
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
  clientOrderNumber: String,
  alteration: {
    type: Number,
    default: 0,
    min: 0,
  },
  handwork: {
    type: Number,
    default: 0,
    min: 0,
  },
  otherCharges: {
    type: Number,
    default: 0,
    min: 0,
  },
  itemStatus: {
    type: String,
    enum: ["pending", "in_progress", "partial_ready", "ready"],
    default: "pending",
  },
  itemStatusUpdatedAt: {
    type: Date,
  },
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
    enum: [
      "pending",
      "confirmed",
      "in_progress",
      "measurement_taken",
      "cutting",
      "stitching",
      "quality_check",
      "ready_for_delivery",
      "out_for_delivery",
      "delivered",
      "completed",
      "on_hold",
      "billed",
      "expired",
    ],
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
  expectedDeliveryDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  subtotal: {
    type: Number,
    default: 0,
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    default: "percentage",
  },
  discountValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  taxableAmount: {
    type: Number,
    default: 0,
  },
  taxRate: {
    type: Number,
    default: 5,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  advancePayment: {
    type: Number,
    default: 0,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "partial", "paid", "overdue", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "upi", "bank_transfer", "cheque", "other"],
  },
  paymentNotes: {
    type: String,
  },
  notes: {
    type: String,
  },
  specialInstructions: {
    type: String,
  },
  shippingDetails: {
    shippingAddress: String,
    shippingCity: String,
    shippingState: String,
    shippingPincode: String,
    shippingPhone: String,
    shippingMethod: {
      type: String,
      enum: [
        "pickup",
        "home_delivery",
        "courier",
        "express",
        "local_transport",
        "customer_courier",
        "aggregator",
        "other",
      ],
      default: "home_delivery",
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    extraField1Label: String,
    extraField1Value: String,
    extraField2Label: String,
    extraField2Value: String,
    deliveryNotes: String,
    deliveryPerson: String,
    deliveryPersonContact: String,
    deliveryStatus: {
      type: String,
      enum: ["pending", "shipped", "in_transit", "out_for_delivery", "delivered", "failed"],
      default: "pending",
    },
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
}, { timestamps: true });

const PendingOrder = mongoose.model("PendingOrder", pendingOrderSchema);
export default PendingOrder;
