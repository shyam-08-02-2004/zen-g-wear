import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  // 1. Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['pageNumber', 'pageSize', 'sort', 'keyword', 'minPrice', 'maxPrice', 'offers'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Handle advanced filtering like price[gte]=100
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  const filter = JSON.parse(queryStr);
  
  // Keyword search
  if (req.query.keyword) {
    filter.name = { $regex: req.query.keyword, $options: 'i' };
  }

  // Category search by name
  if (req.query.categoryName) {
    const categoryDoc = await Category.findOne({ slug: req.query.categoryName.toLowerCase() });
    if (categoryDoc) {
      filter.category = categoryDoc._id;
    } else {
      // Force empty result if category not found
      filter.category = '000000000000000000000000';
    }
    delete filter.categoryName;
  }

  // Subcategory search
  if (req.query.subcategory) {
    const subArr = req.query.subcategory.split(',');
    // Case-insensitive exact match
    filter.subcategory = { $in: subArr.map(s => new RegExp(`^${s}$`, 'i')) };
  }

  // Active products only for users (admin can fetch all if needed, but keeping it simple)
  // Assuming frontend passes ?all=true for admin
  if (req.query.all !== 'true') {
    filter.isActive = true;
  } else {
    delete filter.isActive;
  }

  // Size filter
  if (req.query.sizes) {
    const sizeArr = req.query.sizes.split(',');
    filter.sizes = { $in: sizeArr };
  }

  // Color filter
  if (req.query.colors) {
    const colorArr = req.query.colors.split(',');
    // Case-insensitive match for colors would be ideal, but exact match for now
    filter.colors = { $in: colorArr.map(c => new RegExp(`^${c}$`, 'i')) };
  }

  // Price filter (minPrice, maxPrice)
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  // Offers filter
  if (req.query.offers === 'true') {
    filter.discountPercentage = { $gt: 0 };
  }

  // 2. Sorting
  let sortQuery = '-createdAt';
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    sortQuery = sortBy;
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sortQuery)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ 
    success: true, 
    data: products, 
    page, 
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('linkedProducts', 'name images price discountPrice sizes stock');
  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    slug: `sample-name-${Date.now()}`,
    price: 0,
    createdBy: req.user._id,
    images: [{ url: '/images/sample.jpg', publicId: 'sample' }],
    category: req.body.category,
    brand: 'Sample brand',
    stock: 0,
    numReviews: 0,
    description: 'Sample description',
  });
  const createdProduct = await product.save();
  res.status(201).json({ success: true, data: createdProduct });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { 
    name, price, discountPrice, discountPercentage, description, images, 
    brand, category, stock, sizes, colors, material, sku,
    isFeatured, isTrending, isBestSeller, isNewArrival, isActive,
    specifications, shippingDetails, returnPolicy, linkedProducts
  } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (product) {
    product.name = name !== undefined ? name : product.name;
    product.price = price !== undefined ? price : product.price;
    product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
    product.discountPercentage = discountPercentage !== undefined ? discountPercentage : product.discountPercentage;
    product.description = description !== undefined ? description : product.description;
    product.images = images !== undefined ? images : product.images;
    product.brand = brand !== undefined ? brand : product.brand;
    product.category = category !== undefined ? category : product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.sizes = sizes !== undefined ? sizes : product.sizes;
    product.colors = colors !== undefined ? colors : product.colors;
    product.material = material !== undefined ? material : product.material;
    product.sku = sku !== undefined ? sku : product.sku;
    
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isTrending = isTrending !== undefined ? isTrending : product.isTrending;
    product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;
    product.isNewArrival = isNewArrival !== undefined ? isNewArrival : product.isNewArrival;
    product.isActive = isActive !== undefined ? isActive : product.isActive;
    
    product.specifications = specifications !== undefined ? specifications : product.specifications;
    product.shippingDetails = shippingDetails !== undefined ? shippingDetails : product.shippingDetails;
    product.returnPolicy = returnPolicy !== undefined ? returnPolicy : product.returnPolicy;
    product.linkedProducts = linkedProducts !== undefined ? linkedProducts : product.linkedProducts;
    
    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ success: true, message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
