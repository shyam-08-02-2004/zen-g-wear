import express from 'express';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  createNotificationValidator,
  notificationIdValidator,
} from '../validators/notificationValidators.js';

const router = express.Router();

router.use(protect);

router.get('/', getMyNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', notificationIdValidator, validate, markAsRead);
router.delete('/:id', notificationIdValidator, validate, deleteNotification);

router.post('/', isAdmin, createNotificationValidator, validate, createNotification);

export default router;
