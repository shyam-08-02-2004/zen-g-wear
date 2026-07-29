import express from 'express';
import { syncCart, getAbandonedCarts } from '../controllers/cartController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/sync').post(protect, syncCart);
router.route('/abandoned').get(protect, authorize('admin'), getAbandonedCarts);

export default router;
