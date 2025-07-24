import Gallery from '../models/gallery.js';
import { v2 as cloudinary } from 'cloudinary';

export const createGallery = async (req, res) => {
  try {
    const { title, description, order } = req.body;
    console.log(req.files.galleryImage)
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }
    // Handle image
    let galleryImage = '';
    let imagePublicId = '';
    if (req.files && req.files.galleryImage) {
      galleryImage = req.files.galleryImage[0].path;
      imagePublicId = req.files.galleryImage[0].filename;
    }
    const gallery = await Gallery.create({
      title,
      description,
      galleryImage: galleryImage,
      galleryImagePublicId: imagePublicId,
      order
    });
    res.status(201).json({ success: true, message: 'Gallery image created', gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create gallery image', error: error.message });
  }
};

export const getAllGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ order: 1, updatedAt: -1 });
    res.status(200).json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery', error: error.message });
  }
};

export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) return res.status(404).json({ success: false, message: 'Gallery image not found' });
    res.status(200).json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery image', error: error.message });
  }
};

export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order } = req.body;
    const gallery = await Gallery.findById(id);
    if (!gallery) return res.status(404).json({ success: false, message: 'Gallery image not found' });
    // Handle image
    if (req.files && req.files.galleryImage) {
      if (gallery.imagePublicId) {
        await cloudinary.uploader.destroy(gallery.imagePublicId);
      }
      gallery.galleryImage = req.files.galleryImage[0].path;
      gallery.galleryImagePublicId = req.files.galleryImage[0].filename;
    }
    if (title !== undefined) gallery.title = title;
    if (description !== undefined) gallery.description = description;
    if (order !== undefined) gallery.order = order;
    await gallery.save();
    res.status(200).json({ success: true, message: 'Gallery image updated', gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update gallery image', error: error.message });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) return res.status(404).json({ success: false, message: 'Gallery image not found' });
    // Delete image from Cloudinary
    if (gallery.imagePublicId) {
      await cloudinary.uploader.destroy(gallery.imagePublicId);
    }
    await Gallery.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Gallery image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete gallery image', error: error.message });
  }
}; 