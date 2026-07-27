import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';
import { sendResponse } from '../utils/apiResponse.js';

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public (or Private if you want only logged in users to use it)
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, purchaseAmount } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon code');
  }

  if (!coupon.isActive) {
    res.status(400);
    throw new Error('This coupon is no longer active');
  }

  if (new Date(coupon.expiryDate) < new Date()) {
    res.status(400);
    throw new Error('This coupon has expired');
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error('This coupon usage limit has been reached');
  }

  if (purchaseAmount < coupon.minPurchaseAmount) {
    res.status(400);
    throw new Error(`Minimum purchase of Rs ${coupon.minPurchaseAmount} required`);
  }

  return sendResponse(res, {
    statusCode: 200,
    message: 'Coupon is valid',
    data: { 
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscountAmount: coupon.maxDiscountAmount
      } 
    },
  });
});
