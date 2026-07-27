import express from 'express';
import { createBlog, getBlogs, getBlog, updateBlog, deleteBlog, likeBlog } from '../controllers/blogController.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { createBlogValidator, updateBlogValidator, blogIdValidator } from '../validators/blogValidators.js';

const router = express.Router();

// --- Public ---
router.get('/', optionalAuth, getBlogs);
router.get('/:id', optionalAuth, getBlog);

// --- Private ---
router.post('/:id/like', protect, blogIdValidator, validate, likeBlog);

// --- Admin only ---
router.post('/', isAdmin, createBlogValidator, validate, createBlog);
router.patch('/:id', isAdmin, updateBlogValidator, validate, updateBlog);
router.delete('/:id', isAdmin, blogIdValidator, validate, deleteBlog);

export default router;
