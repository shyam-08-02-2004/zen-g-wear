import { body, param } from 'express-validator';

export const createOrderValidator = [
  body('items').isArray({ min: 1 }).withMessage('An order must contain at least one item'),
  body('items.*.service').isMongoId().withMessage('Each item needs a valid service id'),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('billingAddress').optional().isObject(),
  body('notes').optional().trim().isLength({ max: 500 }),
];

export const orderIdValidator = [param('id').isMongoId().withMessage('Invalid order id')];

export const updateOrderStatusValidator = [
  param('id').isMongoId().withMessage('Invalid order id'),
  body('status')
    .optional()
    .isIn(['pending', 'processing', 'active', 'completed', 'cancelled', 'failed'])
    .withMessage('Invalid order status'),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'failed', 'refunded'])
    .withMessage('Invalid payment status'),
];
