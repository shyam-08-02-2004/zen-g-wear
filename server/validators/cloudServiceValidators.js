import { body, param } from 'express-validator';

const CATEGORIES = ['compute', 'storage', 'database', 'networking', 'security', 'ai-ml', 'other'];
const BILLING_CYCLES = ['hourly', 'monthly', 'yearly', 'one-time'];

export const createServiceValidator = [
  body('name').trim().notEmpty().withMessage('Service name is required').isLength({ max: 120 }),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('pricing.amount')
    .notEmpty()
    .withMessage('Price amount is required')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  body('pricing.billingCycle')
    .optional()
    .isIn(BILLING_CYCLES)
    .withMessage(`Billing cycle must be one of: ${BILLING_CYCLES.join(', ')}`),
  body('pricing.currency').optional().isLength({ min: 3, max: 3 }),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
];

export const updateServiceValidator = [
  param('id').isMongoId().withMessage('Invalid service id'),
  body('name').optional().trim().isLength({ max: 120 }),
  body('category').optional().isIn(CATEGORIES),
  body('shortDescription').optional().trim().isLength({ max: 200 }),
  body('description').optional().trim(),
  body('pricing.amount').optional().isFloat({ min: 0 }),
  body('pricing.billingCycle').optional().isIn(BILLING_CYCLES),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
];

export const serviceIdValidator = [param('id').isMongoId().withMessage('Invalid service id')];
