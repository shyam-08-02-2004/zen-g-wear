import { body, param, query } from 'express-validator';

export const fileIdValidator = [param('id').isMongoId().withMessage('Invalid file id')];

export const updateFileValidator = [
  param('id').isMongoId().withMessage('Invalid file id'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('File name must be between 1 and 255 characters'),
  body('folder')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('Folder must be a valid folder id'),
  body('isStarred').optional().isBoolean().withMessage('isStarred must be a boolean'),
];

export const shareFileValidator = [
  param('id').isMongoId().withMessage('Invalid file id'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('permission')
    .optional()
    .isIn(['view', 'edit'])
    .withMessage("Permission must be either 'view' or 'edit'"),
];

export const listFilesValidator = [
  query('folder').optional({ nullable: true }).isMongoId().withMessage('Invalid folder id'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
