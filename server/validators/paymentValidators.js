import { body, param } from 'express-validator';

export const createPaymentValidator = [
  body('order').isMongoId().withMessage('A valid order id is required'),
  body('method')
    .isIn(['card', 'paypal', 'bank_transfer', 'wallet', 'stripe', 'razorpay'])
    .withMessage('Invalid payment method'),
];

export const paymentIdValidator = [param('id').isMongoId().withMessage('Invalid payment id')];

export const updatePaymentStatusValidator = [
  param('id').isMongoId().withMessage('Invalid payment id'),
  body('status')
    .isIn(['pending', 'completed', 'failed', 'refunded'])
    .withMessage('Invalid payment status'),
];
