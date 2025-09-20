import mongoose from "mongoose";

// Style schema for each item
const styleSchema = new mongoose.Schema({
    styleId: { 
        type: String, 
        required: true 
    },
    styleName: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    }
}, { _id: false });

const itemMasterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    fields: [{ type: String, required: true }],
    description: { type: String },
    category: { type: String, required: true, enum: ['men', 'women', 'unisex'] },
    itemImage: { type: String },
    itemImagePublicId: { type: String },
    secondaryItemImage: { type: String },
    secondaryItemImagePublicId: { type: String },
    stitchingCharge: {
        type: Number,
        default: 0,
        min: 0,
    },
    styles: [styleSchema], // Array of styles for this item
    createdAt: { type: Date, default: Date.now },
});

const ItemMaster = mongoose.model("ItemMaster", itemMasterSchema);
export default ItemMaster;
