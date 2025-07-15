import mongoose from "mongoose";

const itemMasterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    fields: [{ type: String, required: true }],
    description: { type: String },
    itemImage: { type: String },
    itemImagePublicId: { type: String },
    secondaryItemImage: { type: String },
    secondaryItemImagePublicId: { type: String },
    stitchingCharge: {
        type: Number,
        default: 0,
        min: 0,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

const ItemMaster = mongoose.model("ItemMaster", itemMasterSchema);
export default ItemMaster;
