import { body, param } from 'express-validator';

const CATEGORIES = ['news', 'tutorials', 'engineering', 'product', 'company', 'other'];
const STATUSES = ['draft', 'published', 'archived'];

export const createBlogValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 180 }),
  body('excerpt').trim().notEmpty().withMessage('Excerpt is required').isLength({ max: 300 }),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').optional().isIn(CATEGORIES),
  body('tags').optional().isArray(),
  body('status').optional().isIn(STATUSES),
];

export const updateBlogValidator = [
  param('id').isMongoId().withMessage('Invalid blog id'),
  body('title').optional().trim().isLength({ max: 180 }),
  body('excerpt').optional().trim().isLength({ max: 300 }),
  body('content').optional().trim(),
  body('category').optional().isIn(CATEGORIES),
  body('tags').optional().isArray(),
  body('status').optional().isIn(STATUSES),
];

export const blogIdValidator = [param('id').isMongoId().withMessage('Invalid blog id')];
