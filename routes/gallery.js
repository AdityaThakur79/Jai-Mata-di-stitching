import express from 'express';
import {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery
} from '../controllers/gallery.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../utils/common/Uploads.js';

const router = express.Router();

// Public routes
router.get('/all', getAllGallery);
router.get('/:id', getGalleryById);

// Admin routes
router.post('/create', upload, isAuthenticated, createGallery);
router.put('/:id', upload, isAuthenticated, updateGallery);
router.delete('/:id', isAuthenticated, deleteGallery);

export default router; 