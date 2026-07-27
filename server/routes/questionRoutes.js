import express from 'express';
import { getQuestionsByProduct, addQuestion, answerQuestion } from '../controllers/questionController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/product/:productId')
  .get(getQuestionsByProduct)
  .post(protect, addQuestion);

router.route('/:id/answer')
  .patch(protect, authorize('admin'), answerQuestion); // For simplicity, only admins can answer

export default router;
