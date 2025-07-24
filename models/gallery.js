import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  galleryImage: {
    type: String,
    required: true
  },
  galleryImagePublicId: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

gallerySchema.index({ order: 1, updatedAt: -1 });

export default mongoose.model('Gallery', gallerySchema); 