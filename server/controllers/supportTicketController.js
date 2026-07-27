import asyncHandler from 'express-async-handler';
import SupportTicket from '../models/SupportTicket.js';
import Notification from '../models/Notification.js';
import { sendResponse } from '../utils/apiResponse.js';
import { buildFilter, buildSearch, buildSort, getPagination, buildMeta } from '../utils/apiFeatures.js';

// @desc    Create a support ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = asyncHandler(async (req, res) => {
  const { subject, description, category, priority, relatedOrder } = req.body;

  const ticket = await SupportTicket.create({
    user: req.user._id,
    subject,
    description,
    category,
    priority,
    relatedOrder,
    messages: [{ sender: req.user._id, message: description }],
  });

  return sendResponse(res, { statusCode: 201, message: 'Support ticket created successfully', data: { ticket } });
});

// @desc    Get the current user's tickets
// @route   GET /api/tickets/my?status=&priority=&category=&search=&sortBy=&order=&page=&limit=
// @access  Private
export const getMyTickets = asyncHandler(async (req, res) => {
  const filter = {
    user: req.user._id,
    ...buildFilter(req.query, ['status', 'priority', 'category']),
    ...buildSearch(req.query, ['subject', 'ticketNumber']),
  };
  const sort = buildSort(req.query, { createdAt: -1 });
  const { page, limit, skip } = getPagination(req.query);

  const [tickets, total] = await Promise.all([
    SupportTicket.find(filter).sort(sort).skip(skip).limit(limit),
    SupportTicket.countDocuments(filter),
  ]);

  return sendResponse(res, {
    statusCode: 200,
    message: 'Tickets fetched successfully',
    data: { tickets },
    meta: buildMeta({ page, limit, total }),
  });
});

// @desc    Get all tickets (admin triage queue)
// @route   GET /api/tickets?status=&priority=&category=&assignedTo=&search=&sortBy=&order=&page=&limit=
// @access  Private/Admin
export const getAllTickets = asyncHandler(async (req, res) => {
  const filter = {
    ...buildFilter(req.query, ['status', 'priority', 'category', 'assignedTo']),
    ...buildSearch(req.query, ['subject', 'ticketNumber']),
  };
  const sort = buildSort(req.query, { createdAt: -1 });
  const { page, limit, skip } = getPagination(req.query);

  const [tickets, total] = await Promise.all([
    SupportTicket.find(filter)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    SupportTicket.countDocuments(filter),
  ]);

  return sendResponse(res, {
    statusCode: 200,
    message: 'Tickets fetched successfully',
    data: { tickets },
    meta: buildMeta({ page, limit, total }),
  });
});

// @desc    Get a single ticket (owner, assigned agent, or admin)
// @route   GET /api/tickets/:id
// @access  Private
export const getTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id)
    .populate('user', 'name email')
    .populate('assignedTo', 'name email')
    .populate('messages.sender', 'name email role');

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  const isOwner = ticket.user._id.toString() === req.user._id.toString();
  const isAssigned = ticket.assignedTo && ticket.assignedTo._id.toString() === req.user._id.toString();
  if (!isOwner && !isAssigned && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You do not have access to this ticket');
  }

  return sendResponse(res, { statusCode: 200, message: 'Ticket fetched successfully', data: { ticket } });
});

// @desc    Add a reply message to a ticket's thread
// @route   POST /api/tickets/:id/messages
// @access  Private
export const addMessage = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  const isOwner = ticket.user.toString() === req.user._id.toString();
  const isAssigned = ticket.assignedTo && ticket.assignedTo.toString() === req.user._id.toString();
  if (!isOwner && !isAssigned && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You do not have access to this ticket');
  }

  ticket.messages.push({ sender: req.user._id, message: req.body.message });

  // Replying re-opens a resolved/closed ticket automatically
  if (['resolved', 'closed'].includes(ticket.status) && isOwner) {
    ticket.status = 'open';
  }

  await ticket.save();

  const recipient = isOwner ? ticket.assignedTo : ticket.user;
  if (recipient) {
    await Notification.create({
      user: recipient,
      type: 'ticket',
      title: 'New reply on your ticket',
      message: `Ticket ${ticket.ticketNumber} has a new reply.`,
      link: `/tickets/${ticket._id}`,
    });
  }

  return sendResponse(res, { statusCode: 200, message: 'Message added successfully', data: { ticket } });
});

// @desc    Update ticket status/priority/assignment (admin)
// @route   PATCH /api/tickets/:id
// @access  Private/Admin
export const updateTicket = asyncHandler(async (req, res) => {
  const { status, priority, assignedTo } = req.body;

  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  if (status) {
    ticket.status = status;
    if (['resolved', 'closed'].includes(status)) ticket.resolvedAt = new Date();
  }
  if (priority) ticket.priority = priority;
  if (assignedTo) ticket.assignedTo = assignedTo;

  await ticket.save();

  await Notification.create({
    user: ticket.user,
    type: 'ticket',
    title: 'Ticket updated',
    message: `Your ticket ${ticket.ticketNumber} is now '${ticket.status}'.`,
    link: `/tickets/${ticket._id}`,
  });

  return sendResponse(res, { statusCode: 200, message: 'Ticket updated successfully', data: { ticket } });
});
