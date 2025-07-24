import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  // Contact Information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },

  // Service Information
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  serviceName: {
    type: String,
    required: true,
    trim: true
  },

  // Message
  message: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  // Status and Management
  status: {
    type: String,
    enum: ['pending', 'contacted', 'quoted', 'converted', 'closed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  // Source tracking
  source: {
    type: String,
    enum: ['services_page', 'contact_page', 'direct'],
    default: 'services_page'
  },

  // Admin notes
  adminNotes: {
    type: String,
    trim: true
  },

  // Response tracking
  respondedAt: {
    type: Date
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ serviceId: 1 });
enquirySchema.index({ phoneNumber: 1 });
enquirySchema.index({ email: 1 });

export default mongoose.model('Enquiry', enquirySchema); 