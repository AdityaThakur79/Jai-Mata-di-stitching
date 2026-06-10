import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true,
  },
  itemType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItemMaster",
    required: false,
  },
  fabric: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FabricMaster",
  },
  fabricMeters: {
    type: Number,
    min: 0,
  },
  fabricRate: {
    type: Number,
    min: 0,
    default: 0,
  },
  fabricAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  style: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StyleMaster",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  stitchingRate: {
    type: Number,
    min: 0,
    default: 0,
  },
  stitchingAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  measurement: {
    type: Map,
    of: Number,
  },
  designNumber: String,
  description: String,
  alteration: { type: Number, default: 0, min: 0 },
  handwork: { type: Number, default: 0, min: 0 },
  otherCharges: { type: Number, default: 0, min: 0 },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  // Invoice Details
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
  },
  
  // Reference to Pending Order (customer / slip for billing)
  pendingOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PendingOrder",
    required: false,
  },

  // Reference to Client Order
  clientOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: false,
  },

  // Differentiates client orders vs customer (slip for billing) orders
  orderSource: {
    type: String,
    enum: ["client", "customer"],
    required: true,
    default: "customer",
    index: true,
  },

  // Order type from source order
  orderType: {
    type: String,
    enum: ["fabric", "fabric_stitching", "stitching", "readymade", "mixed"],
    index: true,
  },

  // Client reference (for client orders)
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  
  // Customer Details (for customer / slip orders)
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: function () {
      return this.orderSource === "customer";
    },
  },
  
  // Billing Details
  billDate: {
    type: Date,
    default: Date.now,
  },
  
  dueDate: {
    type: Date,
    required: true,
  },
  
  // Financial Details
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  
  gstPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 18, // Default GST rate
  },
  
  gstAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  
  discountAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // Payment Details
  paymentStatus: {
    type: String,
    enum: ["pending", "partial", "paid"],
    default: "pending",
  },
  
  paidAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  
  balanceAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  
  // Additional Details
  remarks: {
    type: String,
    maxLength: 500,
  },
  
  termsAndConditions: {
    type: String,
    maxLength: 1000,
  },

  // Invoice/quotation classification
  documentType: {
    type: String,
    enum: ["invoice", "quotation"],
    default: "invoice",
    index: true,
  },
  invoiceType: {
    type: String,
    enum: ["mixed", "fabric", "stitching"],
    default: "mixed",
    index: true,
  },
  quotationStatus: {
    type: String,
    enum: ["draft", "sent", "accepted", "rejected", "expired"],
    default: "draft",
  },
  quotationReference: {
    type: String,
    default: "",
  },
  sentVia: {
    type: String,
    enum: ["whatsapp", "email", "manual", ""],
    default: "",
  },
  sentAt: Date,
  validUntil: Date,
  
  // Billing Staff
  biller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // Items from pending order with calculated amounts
  items: [invoiceItemSchema],
  
  // Invoice Status
  status: {
    type: String,
    enum: ["draft", "generated", "sent", "paid", "cancelled", "approved"],
    default: "draft",
  },
  
  // PDF Generation
  pdfUrl: String,
  pdfGeneratedAt: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
}, { 
  timestamps: true 
});

// Pre-save middleware to calculate amounts
invoiceSchema.pre('save', function(next) {
  // Calculate GST amount if not already set
  if (this.gstAmount === undefined || this.gstAmount === 0) {
    this.gstAmount = (this.subtotal * this.gstPercentage) / 100;
  }
  
  // Calculate discount amount if not already set
  if (this.discountAmount === undefined || this.discountAmount === 0) {
    this.discountAmount = (this.subtotal * this.discountPercentage) / 100;
  }
  
  // Calculate total amount if not already set
  if (this.totalAmount === undefined || this.totalAmount === 0) {
    this.totalAmount = this.subtotal + this.gstAmount - this.discountAmount;
  }
  
  // Calculate balance amount
  this.balanceAmount = this.totalAmount - this.paidAmount;
  
  // Update payment status based on paid amount
  if (this.paidAmount >= this.totalAmount) {
    this.paymentStatus = "paid";
  } else if (this.paidAmount > 0) {
    this.paymentStatus = "partial";
  } else {
    this.paymentStatus = "pending";
  }
  
  next();
});

// Static method to generate invoice number
invoiceSchema.statics.generateInvoiceNumber = async function() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Find the last invoice for this year/month
  const lastInvoice = await this.findOne({
    invoiceNumber: { $regex: `^INV-${year}${month}-` }
  }).sort({ invoiceNumber: -1 });
  
  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  return `INV-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

// Method to calculate item totals
invoiceSchema.methods.calculateItemTotals = function() {
  this.items.forEach(item => {
    // Calculate fabric amount
    item.fabricAmount = (item.fabricMeters || 0) * (item.fabricRate || 0);
    
    // Calculate stitching amount
    item.stitchingAmount = item.quantity * (item.stitchingRate || 0);
    
    // Calculate total for this item
    item.totalAmount = item.fabricAmount + item.stitchingAmount;
  });
  
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalAmount, 0);
  
  return this;
};

// Partial unique indexes — only index when the ref is actually set (avoids null duplicate errors)
invoiceSchema.index(
  { pendingOrder: 1 },
  {
    unique: true,
    partialFilterExpression: { pendingOrder: { $type: "objectId" } },
  }
);
invoiceSchema.index(
  { clientOrder: 1 },
  {
    unique: true,
    partialFilterExpression: { clientOrder: { $type: "objectId" } },
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export const fixInvoiceIndexes = async () => {
  const collection = mongoose.connection.collection("invoices");
  for (const indexName of ["pendingOrder_1", "clientOrder_1"]) {
    try {
      await collection.dropIndex(indexName);
    } catch {
      // Index may not exist
    }
  }
  await Invoice.syncIndexes();
};

export default Invoice;
