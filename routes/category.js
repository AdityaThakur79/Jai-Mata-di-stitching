import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/category.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../utils/common/Uploads.js';

const router = express.Router();

// Public routes
router.get('/all', getAllCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/create', upload, isAuthenticated, createCategory);
router.put('/:id',upload, isAuthenticated, updateCategory);
router.delete('/:id', isAuthenticated, deleteCategory);

export default router; 