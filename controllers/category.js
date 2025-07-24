import Category from '../models/category.js';
import { v2 as cloudinary } from 'cloudinary';

export const createCategory = async (req, res) => {
  try {
    const { title, shortDesc, features, startingFrom, category, order } = req.body;
    if (!title || !startingFrom || !category) {
      return res.status(400).json({ success: false, message: 'Title, startingFrom, and category are required.' });
    }
    // Handle images
    let categoryPrimaryImage = '';
    let categoryPrimaryImagePublicId = '';
    let categorySecondaryImage = '';
    let categorySecondaryImagePublicId = '';
    if (req.files && req.files.categoryPrimaryImage) {
      categoryPrimaryImage = req.files.categoryPrimaryImage[0].path;
      categoryPrimaryImagePublicId = req.files.categoryPrimaryImage[0].filename;
    }
    if (req.files && req.files.categorySecondaryImage) {
      categorySecondaryImage = req.files.categorySecondaryImage[0].path;
      categorySecondaryImagePublicId = req.files.categorySecondaryImage[0].filename;
    }
    const cat = await Category.create({
      title,
      shortDesc,
      features: Array.isArray(features) ? features : (features ? [features] : []),
      startingFrom,
      category,
      categoryPrimaryImage,
      categoryPrimaryImagePublicId,
      categorySecondaryImage,
      categorySecondaryImagePublicId,
      order
    });
    res.status(201).json({ success: true, message: 'Category created', category: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, updatedAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, category: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch category', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, shortDesc, features, startingFrom, category, order } = req.body;
    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    // Handle images
    if (req.files && req.files.categoryPrimaryImage) {
      if (cat.categoryPrimaryImagePublicId) {
        await cloudinary.uploader.destroy(cat.categoryPrimaryImagePublicId);
      }
      cat.categoryPrimaryImage = req.files.categoryPrimaryImage[0].path;
      cat.categoryPrimaryImagePublicId = req.files.categoryPrimaryImage[0].filename;
    }
    if (req.files && req.files.categorySecondaryImage) {
      if (cat.categorySecondaryImagePublicId) {
        await cloudinary.uploader.destroy(cat.categorySecondaryImagePublicId);
      }
      cat.categorySecondaryImage = req.files.categorySecondaryImage[0].path;
      cat.categorySecondaryImagePublicId = req.files.categorySecondaryImage[0].filename;
    }
    if (title !== undefined) cat.title = title;
    if (shortDesc !== undefined) cat.shortDesc = shortDesc;
    if (features !== undefined) cat.features = Array.isArray(features) ? features : (features ? [features] : []);
    if (startingFrom !== undefined) cat.startingFrom = startingFrom;
    if (category !== undefined) cat.category = category;
    if (order !== undefined) cat.order = order;
    await cat.save();
    res.status(200).json({ success: true, message: 'Category updated', category: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    // Delete images from Cloudinary
    if (cat.categoryPrimaryImagePublicId) {
      await cloudinary.uploader.destroy(cat.categoryPrimaryImagePublicId);
    }
    if (cat.categorySecondaryImagePublicId) {
      await cloudinary.uploader.destroy(cat.categorySecondaryImagePublicId);
    }
    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category', error: error.message });
  }
}; 