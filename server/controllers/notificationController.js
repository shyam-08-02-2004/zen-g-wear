import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendResponse } from '../utils/apiResponse.js';
import { buildFilter, buildSort, getPagination, buildMeta } from '../utils/apiFeatures.js';

// @desc    Get the current user's notifications
// @route   GET /api/notifications?isRead=&type=&sortBy=&order=&page=&limit=
// @access  Private
export const getMyNotifications = asyncHandler(async (req, res) => {
  const filter = {
    user: req.user._id,
    ...buildFilter(req.query, ['isRead', 'type']),
  };
  const sort = buildSort(req.query, { createdAt: -1 });
  const { page, limit, skip } = getPagination(req.query);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort(sort).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: req.user._id, isRead: false }),
  ]);

  return sendResponse(res, {
    statusCode: 200,
    message: 'Notifications fetched successfully',
    data: { notifications, unreadCount },
    meta: buildMeta({ page, limit, total }),
  });
});

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  return sendResponse(res, { statusCode: 200, message: 'Notification marked as read', data: { notification } });
});

// @desc    Mark all of the current user's notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  return sendResponse(res, {
    statusCode: 200,
    message: 'All notifications marked as read',
    data: { modifiedCount: result.modifiedCount },
  });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  return sendResponse(res, { statusCode: 200, message: 'Notification deleted successfully' });
});

// @desc    Create a notification for a specific user, or broadcast to all active users
// @route   POST /api/notifications
// @access  Private/Admin
export const createNotification = asyncHandler(async (req, res) => {
  const { user, broadcast, type, title, message, link } = req.body;

  if (broadcast) {
    const users = await User.find({ isActive: true }).select('_id');
    const docs = users.map((u) => ({ user: u._id, type, title, message, link }));
    const created = await Notification.insertMany(docs);

    return sendResponse(res, {
      statusCode: 201,
      message: `Notification broadcast to ${created.length} users`,
      data: { count: created.length },
    });
  }

  if (!user) {
    res.status(400);
    throw new Error('Either a target user id or broadcast: true is required');
  }

  const notification = await Notification.create({ user, type, title, message, link });

  return sendResponse(res, { statusCode: 201, message: 'Notification created successfully', data: { notification } });
});
