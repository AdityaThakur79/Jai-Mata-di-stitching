import mongoose from "mongoose";

const itemMasterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    fields: [{ type: String, required: true }],
    description: { type: String },
    stitchingCharge: {
        type: Number,
        default: 0,
        min: 0,
    },
    createdAt: { type: Date, default: Date.now },
});

const ItemMaster = mongoose.model("ItemMaster", itemMasterSchema);
export default ItemMaster;
