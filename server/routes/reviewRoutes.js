import express from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, upload.array('images', 3), createReview);

router.route('/:productId')
  .get(getProductReviews);

export default router;
