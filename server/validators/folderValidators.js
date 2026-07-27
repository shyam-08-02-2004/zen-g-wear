import { body, param, query } from 'express-validator';

export const createFolderValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Folder name is required')
    .isLength({ max: 100 })
    .withMessage('Folder name cannot exceed 100 characters'),
  body('parent')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('Parent must be a valid folder id'),
];

export const renameFolderValidator = [
  param('id').isMongoId().withMessage('Invalid folder id'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Folder name is required')
    .isLength({ max: 100 })
    .withMessage('Folder name cannot exceed 100 characters'),
];

export const folderIdValidator = [param('id').isMongoId().withMessage('Invalid folder id')];

export const listFoldersValidator = [
  query('parent')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('Parent must be a valid folder id'),
];
