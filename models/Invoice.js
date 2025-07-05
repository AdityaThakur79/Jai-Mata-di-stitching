import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true,
  },
  itemType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItemMaster",
    required: true,
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
  
  // Reference to Pending Order
  pendingOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PendingOrder",
    required: true,
    unique: true, // One invoice per pending order
  },
  
  // Customer Details (copied from pending order for reference)
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
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
    enum: ["draft", "generated", "sent", "paid", "cancelled"],
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

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
