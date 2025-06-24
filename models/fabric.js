import mongoose from "mongoose";

const fabricMasterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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
  fabricImage: {
    type: String,
  },
  fabricImagePublicId: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FabricMaster = mongoose.model("FabricMaster", fabricMasterSchema);
export default FabricMaster;
