import asyncHandler from 'express-async-handler';
import Question from '../models/Question.js';
import Product from '../models/Product.js';

// Get questions for a product
export const getQuestionsByProduct = asyncHandler(async (req, res) => {
  const questions = await Question.find({ product: req.params.productId })
    .populate('user', 'name')
    .populate('answeredBy', 'name role')
    .sort('-createdAt');
  res.json({ success: true, data: questions });
});

// Add a question
export const addQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const newQuestion = await Question.create({
    product: product._id,
    user: req.user._id,
    question,
  });

  res.status(201).json({ success: true, data: newQuestion });
});

// Answer a question (Admin or user)
export const answerQuestion = asyncHandler(async (req, res) => {
  const { answer } = req.body;
  const question = await Question.findById(req.params.id);

  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }

  question.answer = answer;
  question.answeredBy = req.user._id;

  const updatedQuestion = await question.save();
  res.json({ success: true, data: updatedQuestion });
});
