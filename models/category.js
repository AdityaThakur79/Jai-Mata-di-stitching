import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  shortDesc: {
    type: String,
    trim: true,
    maxlength: 300
  },
  features: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  startingFrom: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    required: true
  },
  categoryPrimaryImage: {
    type: String,
    required: true
  },
  categoryPrimaryImagePublicId: {
    type: String,
    required: true
  },
  categorySecondaryImage: {
    type: String
  },
  categorySecondaryImagePublicId: {
    type: String
  },
  order: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

categorySchema.index({ order: 1, updatedAt: -1 });

export default mongoose.model('Category', categorySchema); 