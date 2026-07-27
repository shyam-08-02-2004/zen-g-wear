import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  cancelOrder,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, authorize('admin'), getOrders);
router.route('/my').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/cancel').patch(protect, cancelOrder);
router.route('/:id/status').patch(protect, authorize('admin'), updateOrderStatus);

export default router;
