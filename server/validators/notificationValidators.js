import { body, param } from 'express-validator';

export const createNotificationValidator = [
  body('user').optional().isMongoId().withMessage('Invalid user id'),
  body('broadcast').optional().isBoolean(),
  body('type')
    .isIn(['order', 'payment', 'invoice', 'ticket', 'system', 'promotion'])
    .withMessage('Invalid notification type'),
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 500 }),
  body('link').optional().isString(),
];

export const notificationIdValidator = [
  param('id').isMongoId().withMessage('Invalid notification id'),
];
