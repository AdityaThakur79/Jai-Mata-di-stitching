import mongoose from "mongoose";

const itemMasterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    fields: [{ type: String, required: true }],
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const ItemMaster = mongoose.model("ItemMaster", itemMasterSchema);
export default ItemMaster;
