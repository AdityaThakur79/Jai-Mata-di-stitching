import mongoose from "mongoose";

const styleMasterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ItemMaster",
            required: true,
        },
        description: {
            type: String,
        },
        styleImage: {
            type: String,
        },
        styleImagePublicId: {
            type: String,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const StyleMaster = mongoose.model("StyleMaster", styleMasterSchema);
export default StyleMaster;
