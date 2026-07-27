import express from 'express';
import {
  createContactMessage,
  getContactMessages,
  getContactMessage,
  respondToMessage,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/contactController.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiters.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  createContactMessageValidator,
  messageIdValidator,
  respondValidator,
  updateStatusValidator,
} from '../validators/contactValidators.js';

const router = express.Router();

// --- Public ---
router.post('/', authLimiter, createContactMessageValidator, validate, createContactMessage);

// --- Admin only ---
router.get('/', isAdmin, getContactMessages);
router.get('/:id', isAdmin, messageIdValidator, validate, getContactMessage);
router.patch('/:id/respond', isAdmin, respondValidator, validate, respondToMessage);
router.patch('/:id/status', isAdmin, updateStatusValidator, validate, updateMessageStatus);
router.delete('/:id', isAdmin, messageIdValidator, validate, deleteMessage);

export default router;
