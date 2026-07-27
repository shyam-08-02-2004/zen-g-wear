import express from 'express';
import { body, param } from 'express-validator';
import {
  getUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/userController.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- User Private Routes ---
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

// --- User Address Routes ---
import { getAddresses, addAddress, deleteAddress, setDefaultAddress } from '../controllers/userController.js';
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.put('/addresses/:addressId/default', protect, setDefaultAddress);

// Every route below requires an authenticated admin
router.use(isAdmin);

router.get('/', getUsers);
router.get('/:id', param('id').isMongoId(), validate, getUser);

router.patch(
  '/:id/role',
  param('id').isMongoId(),
  body('role').isIn(['user', 'admin']).withMessage("Role must be 'user' or 'admin'"),
  validate,
  updateUserRole
);

router.patch(
  '/:id/status',
  param('id').isMongoId(),
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  validate,
  updateUserStatus
);

router.delete('/:id', param('id').isMongoId(), validate, deleteUser);

export default router;
