import express from 'express';
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  getTicket,
  addMessage,
  updateTicket,
} from '../controllers/supportTicketController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  createTicketValidator,
  ticketIdValidator,
  addMessageValidator,
  updateTicketValidator,
} from '../validators/supportTicketValidators.js';

const router = express.Router();

router.use(protect);

router.post('/', createTicketValidator, validate, createTicket);
router.get('/my', getMyTickets);
router.get('/', isAdmin, getAllTickets);
router.get('/:id', ticketIdValidator, validate, getTicket);
router.post('/:id/messages', addMessageValidator, validate, addMessage);
router.patch('/:id', isAdmin, updateTicketValidator, validate, updateTicket);

export default router;
