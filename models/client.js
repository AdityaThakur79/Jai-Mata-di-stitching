import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  clientId: {
    type: String,
    unique: true,
  },
  // GSTIN identifier (optional)
  gstin: {
    type: String,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
  },
  profileImage: {
    type: String,
  },
  profileImagePublicId: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
  },
  // Reference to the branch where client is registered
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  // Reference to the employee who registered this client
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
}, {
  timestamps: true,
});

// Generate client ID before saving
clientSchema.pre("save", async function (next) {
  if (this.isNew && !this.clientId) {
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
      
      // Find the last client with a clientId for this month
      const lastClient = await this.constructor.findOne(
        { clientId: new RegExp(`^CLI-${currentYear}${currentMonth}-\\d{4}$`) },
        {},
        { sort: { clientId: -1 } }
      );

      let nextIdNum = 1;
      if (lastClient && lastClient.clientId) {
        const lastIdNum = parseInt(lastClient.clientId.split("-")[2]);
        nextIdNum = lastIdNum + 1;
      }
      
      this.clientId = `CLI-${currentYear}${currentMonth}-${String(nextIdNum).padStart(4, "0")}`;
    } catch (error) {
      next(error);
    }
  }
  next();
});

const Client = mongoose.model("Client", clientSchema);
export default Client;
