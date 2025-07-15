import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema({
  itemType: { type: String  },  
  values: {
    length: Number,
    shoulder: Number,
    sleeve: Number,
    waist: Number,
    hip: Number,
    thigh: Number,
    chest: Number,
    stomach: Number,
    hipSeat: Number,
    knee: Number,
    bottom: Number,
    crochLengthFly: Number,
    neckCollar: Number,
    backLength: Number,
    bicep: Number,
    cuff: Number,
  },
  date: { type: Date, default: Date.now }
});

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  profileImage: { type: String },  
  profileImagePublicId :{type:String},
  measurements: [measurementSchema],  
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
