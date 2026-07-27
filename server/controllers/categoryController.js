import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json({ success: true, data: categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, image } = req.body;
  const categoryExists = await Category.findOne({ slug });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }
  const category = await Category.create({ name, slug, description, image });
  res.status(201).json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await Category.deleteOne({ _id: category._id });
    res.json({ success: true, message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});
