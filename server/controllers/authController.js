import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { verificationEmailTemplate, passwordResetEmailTemplate } from '../utils/emailTemplates.js';
import { sendResponse } from '../utils/apiResponse.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/tokenService.js';

const isProd = process.env.NODE_ENV === 'production';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax',
  path: '/api/auth/refresh-token',
};

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax',
};

/**
 * Issues a fresh access + refresh token pair for a user, persists the
 * refresh token's hash on the document, sets both as httpOnly cookies,
 * and returns them in the JSON body too (for non-cookie clients).
 */
const issueTokens = async (user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  const THIRTY_YEARS = 30 * 365 * 24 * 60 * 60 * 1000;
  res.cookie('token', accessToken, {
    ...ACCESS_COOKIE_OPTIONS,
    maxAge: THIRTY_YEARS,
  });
  res.cookie('refreshToken', refreshToken, {
    ...REFRESH_COOKIE_OPTIONS,
    maxAge: THIRTY_YEARS,
  });
};

export const createInitialAdmin = asyncHandler(async (req, res) => {
  let admin = await User.findOne({ email: 'zeng9755@gmail.com' });
  if (!admin) {
    admin = await User.create({
      name: 'Zen-G Admin',
      email: 'zeng9755@gmail.com',
      password: 'shyam@9755',
      role: 'admin',
      isEmailVerified: true
    });
    res.send('Admin created successfully! You can now login.');
  } else {
    admin.password = 'shyam@9755';
    admin.role = 'admin';
    await admin.save();
    res.send('Admin updated successfully! You can now login.');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });

  const rawVerificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawVerificationToken}`;
  let emailSent = true;
  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your Zen-G Wear email address',
      html: verificationEmailTemplate(user.name, verifyUrl),
    });
  } catch (err) {
    emailSent = false;
  }

  const { accessToken, refreshToken } = await issueTokens(user);
  setAuthCookies(res, { accessToken, refreshToken });

  return sendResponse(res, {
    statusCode: 201,
    message: emailSent
      ? 'Registration successful. Please check your email to verify your account.'
      : 'Registration successful. We could not send a verification email right now.',
    data: {
      user,
      accessToken,
      refreshToken,
      // Only exposed outside production to make local/Postman testing possible
      // without a real SMTP provider configured.
      ...(isProd ? {} : { devVerificationToken: rawVerificationToken }),
    },
  });
});

// @desc    Authenticate user & issue tokens
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  if (email) email = email.trim();

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('This account has been deactivated');
  }

  user.lastLogin = Date.now();
  const { accessToken, refreshToken } = await issueTokens(user);
  setAuthCookies(res, { accessToken, refreshToken });

  return sendResponse(res, {
    statusCode: 200,
    message: 'Logged in successfully',
    data: { user, accessToken, refreshToken },
  });
});

// @desc    Exchange a valid refresh token for a new access token (rotates the refresh token too)
// @route   POST /api/auth/refresh-token
// @access  Public (requires a valid refresh token via cookie or body)
export const refreshTokenHandler = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingToken) {
    res.status(401);
    throw new Error('Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingToken);
  } catch (err) {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || !user.refreshToken || user.refreshToken !== hashToken(incomingToken)) {
    res.status(401);
    throw new Error('Refresh token is no longer valid, please log in again');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('This account has been deactivated');
  }

  // Rotate: issue a brand new pair and invalidate the old refresh token
  const { accessToken, refreshToken } = await issueTokens(user);
  setAuthCookies(res, { accessToken, refreshToken });

  return sendResponse(res, {
    statusCode: 200,
    message: 'Access token refreshed',
    data: { accessToken, refreshToken },
  });
});

// @desc    Log out current user (clear cookies + invalidate refresh token)
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

  res.clearCookie('token', ACCESS_COOKIE_OPTIONS);
  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);

  return sendResponse(res, { statusCode: 200, message: 'Logged out successfully' });
});

// @desc    Verify email address using the token emailed at registration
// @route   POST /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpire');

  if (!user) {
    res.status(400);
    throw new Error('Verification link is invalid or has expired');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save({ validateBeforeSave: false });

  return sendResponse(res, { statusCode: 200, message: 'Email verified successfully' });
});

// @desc    Resend the email verification link
// @route   POST /api/auth/resend-verification
// @access  Private
export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error('This email address is already verified');
  }

  const rawVerificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawVerificationToken}`;
  let emailSent = true;
  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your Zen-G Wear email address',
      html: verificationEmailTemplate(user.name, verifyUrl),
    });
  } catch (err) {
    emailSent = false;
  }

  return sendResponse(res, {
    statusCode: 200,
    message: emailSent
      ? 'Verification email sent'
      : 'Could not send verification email right now',
    data: isProd ? null : { devVerificationToken: rawVerificationToken },
  });
});

// @desc    Request a password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Always respond the same way whether or not the account exists,
  // to avoid leaking which emails are registered.
  const genericMessage = 'If an account with that email exists, a reset link has been sent.';

  if (!user) {
    return sendResponse(res, { statusCode: 200, message: genericMessage });
  }

  const rawResetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawResetToken}`;
  let emailSent = true;
  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your Zen-G Wear password',
      html: passwordResetEmailTemplate(user.name, resetUrl),
    });
  } catch (err) {
    emailSent = false;
  }

  return sendResponse(res, {
    statusCode: 200,
    message: emailSent ? genericMessage : 'Could not send the reset email right now',
    data: isProd ? null : { devResetToken: rawResetToken },
  });
});

// @desc    Reset password using the token emailed via forgot-password
// @route   PATCH /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    res.status(400);
    throw new Error('Reset link is invalid or has expired');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const { accessToken, refreshToken } = await issueTokens(user);
  setAuthCookies(res, { accessToken, refreshToken });

  return sendResponse(res, {
    statusCode: 200,
    message: 'Password reset successfully',
    data: { user, accessToken, refreshToken },
  });
});

// @desc    Get currently authenticated user's profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  return sendResponse(res, { statusCode: 200, message: 'Profile fetched', data: { user: req.user } });
});

// @desc    Update name / email
// @route   PATCH /api/auth/update-details
// @access  Private
export const updateDetails = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {};
  if (req.body.name) fieldsToUpdate.name = req.body.name;
  if (req.body.email) fieldsToUpdate.email = req.body.email;

  if (fieldsToUpdate.email) {
    const existing = await User.findOne({
      email: fieldsToUpdate.email,
      _id: { $ne: req.user._id },
    });
    if (existing) {
      res.status(400);
      throw new Error('Email is already in use by another account');
    }
    // Changing the email re-triggers verification
    fieldsToUpdate.isEmailVerified = false;
  }

  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  return sendResponse(res, { statusCode: 200, message: 'Profile updated', data: { user } });
});

// @desc    Update current password
// @route   PATCH /api/auth/update-password
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  const { accessToken, refreshToken } = await issueTokens(user);
  setAuthCookies(res, { accessToken, refreshToken });

  return sendResponse(res, {
    statusCode: 200,
    message: 'Password updated successfully',
    data: { user, accessToken, refreshToken },
  });
});

// @desc    Deactivate the current user's own account
// @route   DELETE /api/auth/me
// @access  Private
export const deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false, refreshToken: null });

  res.clearCookie('token', ACCESS_COOKIE_OPTIONS);
  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);

  return sendResponse(res, { statusCode: 200, message: 'Account deactivated successfully' });
});
