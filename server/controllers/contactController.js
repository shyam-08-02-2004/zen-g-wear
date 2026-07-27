import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';
import { sendResponse } from '../utils/apiResponse.js';
import { buildFilter, buildSearch, buildSort, getPagination, buildMeta } from '../utils/apiFeatures.js';

// @desc    Submit a public contact form message
// @route   POST /api/contact
// @access  Public
export const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const contactMessage = await ContactMessage.create({
    name,
    email,
    phone,
    subject,
    message,
    ipAddress: req.ip,
  });

  return sendResponse(res, {
    statusCode: 201,
    message: "Thanks for reaching out — we'll get back to you soon.",
    data: { contactMessage },
  });
});

// @desc    List contact messages (admin inbox)
// @route   GET /api/contact?status=&search=&sortBy=&order=&page=&limit=
// @access  Private/Admin
export const getContactMessages = asyncHandler(async (req, res) => {
  const filter = {
    ...buildFilter(req.query, ['status']),
    ...buildSearch(req.query, ['name', 'email', 'subject', 'message']),
  };
  const sort = buildSort(req.query, { createdAt: -1 });
  const { page, limit, skip } = getPagination(req.query);

  const [messages, total] = await Promise.all([
    ContactMessage.find(filter).sort(sort).skip(skip).limit(limit),
    ContactMessage.countDocuments(filter),
  ]);

  return sendResponse(res, {
    statusCode: 200,
    message: 'Contact messages fetched successfully',
    data: { messages },
    meta: buildMeta({ page, limit, total }),
  });
});

// @desc    Get a single contact message (marks it as read)
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactMessage = asyncHandler(async (req, res) => {
  const contactMessage = await ContactMessage.findById(req.params.id);

  if (!contactMessage) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (contactMessage.status === 'new') {
    contactMessage.status = 'read';
    await contactMessage.save();
  }

  return sendResponse(res, { statusCode: 200, message: 'Message fetched successfully', data: { contactMessage } });
});

// @desc    Respond to a contact message
// @route   PATCH /api/contact/:id/respond
// @access  Private/Admin
export const respondToMessage = asyncHandler(async (req, res) => {
  const contactMessage = await ContactMessage.findById(req.params.id);

  if (!contactMessage) {
    res.status(404);
    throw new Error('Message not found');
  }

  contactMessage.response = req.body.response;
  contactMessage.respondedBy = req.user._id;
  contactMessage.respondedAt = new Date();
  contactMessage.status = 'responded';
  await contactMessage.save();

  return sendResponse(res, { statusCode: 200, message: 'Response sent successfully', data: { contactMessage } });
});

// @desc    Update a contact message's status (e.g. archive)
// @route   PATCH /api/contact/:id/status
// @access  Private/Admin
export const updateMessageStatus = asyncHandler(async (req, res) => {
  const contactMessage = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!contactMessage) {
    res.status(404);
    throw new Error('Message not found');
  }

  return sendResponse(res, { statusCode: 200, message: 'Message status updated', data: { contactMessage } });
});

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteMessage = asyncHandler(async (req, res) => {
  const contactMessage = await ContactMessage.findByIdAndDelete(req.params.id);

  if (!contactMessage) {
    res.status(404);
    throw new Error('Message not found');
  }

  return sendResponse(res, { statusCode: 200, message: 'Message deleted successfully' });
});
