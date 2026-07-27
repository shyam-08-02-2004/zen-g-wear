import express from 'express';
import {
  register,
  login,
  logout,
  refreshTokenHandler,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  getMe,
  updateDetails,
  updatePassword,
  deleteMe,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiters.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  registerValidator,
  loginValidator,
  updateDetailsValidator,
  updatePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
  refreshTokenValidator,
} from '../validators/authValidators.js';

const router = express.Router();

// --- Public ---
router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/refresh-token', refreshTokenValidator, validate, refreshTokenHandler);
router.post('/verify-email/:token', verifyEmailValidator, validate, verifyEmail);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, forgotPassword);
router.patch('/reset-password/:token', authLimiter, resetPasswordValidator, validate, resetPassword);

// --- Private ---
router.post('/logout', protect, logout);
router.post('/resend-verification', protect, resendVerificationEmail);
router.get('/me', protect, getMe);
router.patch('/update-details', protect, updateDetailsValidator, validate, updateDetails);
router.patch('/update-password', protect, updatePasswordValidator, validate, updatePassword);
router.delete('/me', protect, deleteMe);

export default router;
