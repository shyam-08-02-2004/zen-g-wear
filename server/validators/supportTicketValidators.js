import { body, param } from 'express-validator';

export const createTicketValidator = [
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 150 }),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 3000 }),
  body('category').optional().isIn(['billing', 'technical', 'account', 'general', 'other']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('relatedOrder').optional().isMongoId().withMessage('Invalid related order id'),
];

export const ticketIdValidator = [param('id').isMongoId().withMessage('Invalid ticket id')];

export const addMessageValidator = [
  param('id').isMongoId().withMessage('Invalid ticket id'),
  body('message').trim().notEmpty().withMessage('Message content is required').isLength({ max: 3000 }),
];

export const updateTicketValidator = [
  param('id').isMongoId().withMessage('Invalid ticket id'),
  body('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('assignedTo').optional().isMongoId().withMessage('Invalid user id'),
];
