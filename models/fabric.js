import mongoose from "mongoose";

// Counter schema for auto-incrementing SRN
const fabricCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const FabricCounter = mongoose.model("FabricCounter", fabricCounterSchema);

const fabricMasterSchema = new mongoose.Schema({
  srn: {
    type: String,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  hsnCode: {
    type: String,
    trim: true,
    default: "",
  },
  type: {
    type: String,
    required: true,
    enum: ["cotton", "silk", "linen", "polyester", "wool", "rayon", "other"],
    default: "other",
  },
  color: {
    type: String,
    required: true,
  },
  pattern: {
    type: String,
    default: "",
  },
  pricePerMeter: {
    type: Number,
    required: true,
    min: 0,
  },
  inStockMeters: {
    type: Number,
    default: 0,
    min: 0,
  },
  // New fields for dimensions
  length: {
    type: Number,
    default: 0,
    min: 0,
  },
  width: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Barcode management
  fabricBarcodeCount: {
    type: Number,
    default: 5,
    min: 1,
    max: 10,
  },
  barcodeValue: {
    type: String,
  },
  // Threshold and restock
  thresholdValue: {
    type: Number,
    default: 10,
    min: 0,
  },
  restockEmail: {
    type: String,
    trim: true,
    default: "",
  },
  fabricImage: {
    type: String,
  },
  fabricImagePublicId: {
    type: String,
  },
  secondaryFabricImage: {
    type: String,
  },
  secondaryFabricImagePublicId: {
    type: String,
  },
  description: {
    type: String,
  },
  printCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to generate SRN
fabricMasterSchema.pre('save', async function(next) {
  if (this.isNew && !this.srn) {
    try {
      const counter = await FabricCounter.findByIdAndUpdate(
        { _id: 'fabricSRN' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.srn = `FAB-${String(counter.seq).padStart(6, '0')}`;
      
      // Generate barcode value based on SRN
      if (!this.barcodeValue) {
        this.barcodeValue = this.srn;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const FabricMaster = mongoose.model("FabricMaster", fabricMasterSchema);
export { FabricMaster, FabricCounter };
export default FabricMaster;
