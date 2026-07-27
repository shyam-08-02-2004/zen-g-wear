import express from 'express';
import {
  createPayment,
  getMyPayments,
  getAllPayments,
  getPayment,
  updatePaymentStatus,
} from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  createPaymentValidator,
  paymentIdValidator,
  updatePaymentStatusValidator,
} from '../validators/paymentValidators.js';

const router = express.Router();

router.use(protect);

router.post('/', createPaymentValidator, validate, createPayment);
router.get('/my', getMyPayments);
router.get('/', isAdmin, getAllPayments);
router.get('/:id', paymentIdValidator, validate, getPayment);
router.patch('/:id/status', isAdmin, updatePaymentStatusValidator, validate, updatePaymentStatus);

export default router;
