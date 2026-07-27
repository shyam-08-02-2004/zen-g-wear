import { body, param } from 'express-validator';

export const createContactMessageValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^\+?[0-9\s\-()]{7,20}$/)
    .withMessage('Please provide a valid phone number'),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 150 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
];

export const messageIdValidator = [param('id').isMongoId().withMessage('Invalid message id')];

export const respondValidator = [
  param('id').isMongoId().withMessage('Invalid message id'),
  body('response').trim().notEmpty().withMessage('A response message is required').isLength({ max: 2000 }),
];

export const updateStatusValidator = [
  param('id').isMongoId().withMessage('Invalid message id'),
  body('status').isIn(['new', 'read', 'responded', 'archived']).withMessage('Invalid status'),
];
