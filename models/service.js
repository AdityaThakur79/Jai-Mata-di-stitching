import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 150
  },

  gender: {
    type: String,
    required: true,
    enum: ['men', 'women', 'unisex'],
    lowercase: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    // Common categories: 'Formal Wear', 'Traditional Wear', 'Office Wear', 'Casual Wear', 'Bridal Wear', 'Cultural Wear', 'Corporate Wear', 'Ethnic Wear', 'Alterations'
  },
  subcategory: {
    type: String,
    trim: true,
    // Subcategories like: 'Suits', 'Shirts', 'Trousers', 'Kurtas', 'Lehengas', etc.
  },

  // Pricing
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    maxPrice: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    priceType: {
      type: String,
      enum: ['fixed', 'starting_from', 'range', 'custom_quote'],
      default: 'starting_from'
    }
  },
    estimatedDays: {
      type: String,
      required: true,
      trim: true
    },
  features: [{
    type: String,
    trim: true
  }],
  
  // Media - Updated to match fabric pattern
  serviceImage: {
    type: String,
    default: ""
  },
  serviceImagePublicId: {
    type: String,
    default: ""
  },
  secondaryServiceImage: {
    type: String,
    default: ""
  },
  secondaryServiceImagePublicId: {
      type: String,
    default: ""
  },
  
  // SEO and Display
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true // This allows multiple null values but ensures uniqueness for non-null values
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Status and Availability
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'archived'],
    default: 'active'
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
serviceSchema.index({ gender: 1, category: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ slug: 1 });
serviceSchema.index({ tags: 1 });
export default mongoose.model('Service', serviceSchema); 