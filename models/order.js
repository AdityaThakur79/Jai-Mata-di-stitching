import mongoose from "mongoose";

// Item schema for order items
const orderItemSchema = new mongoose.Schema({
  itemType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItemMaster",
    required: false,
  },
  measurement: {
    type: Map,
    of: Number, // field name -> measurement value
    default: {},
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
    styleId: {
      type: String,
    },
    styleName: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  designNumber: {
    type: String,
  },
  description: {
    type: String,
  },
  clientOrderNumber: {
    type: String,
  },
  unitPrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
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
}, { _id: false });

// Bill schema for generated bills
const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
  },
  billDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
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
    default: 5, // 5% GST
  },
  taxAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "overdue"],
    default: "pending",
  },
  paymentDate: {
    type: Date,
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  pendingAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  notes: {
    type: String,
  },
  pdfUrl: {
    type: String,
  },
  pdfPublicId: {
    type: String,
  },
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
  },
  clientOrderNumber: {
    type: String,
    // Optional client-provided or external order reference
  },
  orderType: {
    type: String,
    enum: ["fabric", "fabric_stitching", "stitching", "readymade"],
    required: true,
  },
  status: {
    type: String,
    enum: [
      "pending",           // Order received, waiting for confirmation
      "confirmed",         // Order confirmed by staff
      "in_progress",       // Work started on the order
      "measurement_taken", // Measurements completed
      "cutting",           // Fabric cutting in progress
      "stitching",         // Stitching in progress
      "quality_check",     // Quality check in progress
      "ready_for_delivery", // Order ready for delivery
      "out_for_delivery",  // Order out for delivery
      "delivered",         // Order delivered to customer
      "completed",         // Order fully completed
      "cancelled",         // Order cancelled
      "on_hold"            // Order put on hold
    ],
    default: "pending",
  },
  
  // Client information
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  clientDetails: {
    gstin: { type: String },
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
  },
  
  // Order items
  items: [orderItemSchema],
  
  
  // Order details
  expectedDeliveryDate: {
    type: Date,
  },
  actualDeliveryDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  
  // Pricing
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
    default: 18, // 18% GST
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  
  // Bill information
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bill",
  },
  
  // Payment information
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
  paymentAmount: {
    type: Number,
    default: 0,
  },
  paymentDate: {
    type: Date,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "upi", "bank_transfer", "cheque", "other"],
  },
  paymentNotes: {
    type: String,
  },
  
  // Additional information
  notes: {
    type: String,
  },
  specialInstructions: {
    type: String,
  },
  
  // Shipping details
  shippingDetails: {
    shippingAddress: {
      type: String,
    },
    shippingCity: {
      type: String,
    },
    shippingState: {
      type: String,
    },
    shippingPincode: {
      type: String,
    },
    shippingPhone: {
      type: String,
    },
    shippingMethod: {
      type: String,
      enum: ["pickup", "home_delivery", "courier", "express"],
      default: "home_delivery",
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    // trackingNumber removed
    estimatedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },
    deliveryNotes: {
      type: String,
    },
    deliveryPerson: {
      type: String,
    },
    deliveryPersonContact: {
      type: String,
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "shipped", "in_transit", "out_for_delivery", "delivered", "failed"],
      default: "pending",
    },
  },
  
  // Branch and user tracking
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
}, {
  timestamps: true,
});

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

    const nextDate = new Date(now);
    nextDate.setMonth(nextDate.getMonth() + 1);
    const nextYear = nextDate.getFullYear();
    const nextMonth = String(nextDate.getMonth() + 1).padStart(2, "0");

    // New desired pattern: JMD-YYYYMM-YYYYMM-####
    const periodFrom = `${currentYear}${currentMonth}`;
    const periodTo = `${nextYear}${nextMonth}`;

    const regex = new RegExp(`^JMD-${periodFrom}-${periodTo}-\\d{4}$`);
    const lastOrder = await this.constructor.findOne(
      { orderNumber: regex },
      {},
      { sort: { orderNumber: -1 } }
    );

    let nextIdNum = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const parts = lastOrder.orderNumber.split("-");
      const lastIdNum = parseInt(parts[3]);
      nextIdNum = lastIdNum + 1;
    }

    this.orderNumber = `JMD-${periodFrom}-${periodTo}-${String(nextIdNum).padStart(4, "0")}`;
  }
  next();
});

// Generate bill number when bill is created
billSchema.pre("save", async function (next) {
  if (this.isNew && !this.billNumber) {
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    
    const lastBill = await this.constructor.findOne(
      { billNumber: new RegExp(`^BILL-${currentYear}${currentMonth}-\\d{4}$`) },
      {},
      { sort: { billNumber: -1 } }
    );

    let nextIdNum = 1;
    if (lastBill && lastBill.billNumber) {
      const lastIdNum = parseInt(lastBill.billNumber.split("-")[2]);
      nextIdNum = lastIdNum + 1;
    }
    
    this.billNumber = `JMD-BILL-${currentYear}${currentMonth}-${String(nextIdNum).padStart(4, "0")}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
const Bill = mongoose.model("Bill", billSchema);

export default Order;
export { Bill };
