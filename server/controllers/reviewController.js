import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { sendResponse } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  let images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      try {
        const result = await uploadToCloudinary(file.path, 'zen-g-wear/reviews');
        images.push({ url: result.secure_url, publicId: result.public_id });
      } catch (err) {
        console.error('Cloudinary upload error:', err);
      }
    }
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating: Number(rating),
    title,
    comment,
    images,
    isApproved: true, // auto approve for now to make it easy to see
  });

  const reviews = await Review.find({ product: productId, isApproved: true });
  product.numReviews = reviews.length;
  product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await product.save();

  return sendResponse(res, {
    statusCode: 201,
    message: 'Review added',
    data: { review },
  });
});

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  return sendResponse(res, {
    statusCode: 200,
    message: 'Reviews fetched',
    data: { reviews },
  });
});
