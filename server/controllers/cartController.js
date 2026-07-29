import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import { sendResponse } from '../utils/apiResponse.js';

// @desc    Sync cart from frontend to database
// @route   POST /api/cart/sync
// @access  Private
export const syncCart = asyncHandler(async (req, res) => {
  const { cartItems, totalPrice } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = cartItems;
    cart.totalPrice = totalPrice;
    await cart.save();
  } else {
    cart = await Cart.create({
      user: req.user._id,
      items: cartItems,
      totalPrice,
    });
  }

  return sendResponse(res, {
    statusCode: 200,
    message: 'Cart synced successfully',
    data: { cart },
  });
});

// @desc    Get all abandoned carts (older than 2 hours, with items)
// @route   GET /api/cart/abandoned
// @access  Private/Admin
export const getAbandonedCarts = asyncHandler(async (req, res) => {
  // Find carts where items array is not empty and updatedAt is older than 2 hours
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  
  const carts = await Cart.find({
    items: { $exists: true, $not: { $size: 0 } },
    updatedAt: { $lt: twoHoursAgo },
    totalPrice: { $gt: 0 }
  })
  .populate('user', 'name email phone')
  .sort('-updatedAt');

  return sendResponse(res, {
    statusCode: 200,
    message: 'Abandoned carts fetched',
    data: { carts },
  });
});
