import mongoose from "mongoose";

const catalogueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, enum: ["men", "women", "unisex"], required: true },
    type: { type: String, required: true, trim: true }, // e.g., blazer, suit, kurta
    driveUrl: { type: String, required: true },
    featuredImageUrl: { type: String },
    featuredImagePublicId: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

const Catalogue = mongoose.model("Catalogue", catalogueSchema);
export default Catalogue;


