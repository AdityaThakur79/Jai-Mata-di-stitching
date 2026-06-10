import mongoose from "mongoose";
import Invoice, { fixInvoiceIndexes } from "../models/Invoice.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected");
    await fixInvoiceIndexes();
    // Clean up null ref fields that conflict with old sparse indexes
    await Invoice.updateMany({ pendingOrder: null }, { $unset: { pendingOrder: "" } });
    await Invoice.updateMany({ clientOrder: null }, { $unset: { clientOrder: "" } });
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
