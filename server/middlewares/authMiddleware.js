import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { verifyAccessToken } from '../utils/tokenService.js';

// Protect routes - verifies JWT (from header or cookie) and attaches user to req
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, invalid or expired token');
  }

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    res.status(401);
    throw new Error('Not authorized, user no longer exists');
  }

  if (!currentUser.isActive) {
    res.status(403);
    throw new Error('This account has been deactivated');
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    res.status(401);
    throw new Error('Password was changed recently, please log in again');
  }

  req.user = currentUser;
  next();
});

// Restrict access to specific roles, e.g. authorize('admin')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role '${req.user?.role}' is not authorized to access this resource`);
    }
    next();
  };
};

// Optional gate for routes that should only work once the user has
// confirmed their email address (apply after `protect`).
export const requireVerifiedEmail = (req, res, next) => {
  if (!req.user?.isEmailVerified) {
    res.status(403);
    throw new Error('Please verify your email address to access this resource');
  }
  next();
};

// Attaches req.user if a valid token is present, but never blocks the
// request if it's missing/invalid. Useful for public endpoints (e.g. the
// service catalog) that show extra data to logged-in admins.
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) return next();

  try {
    const decoded = verifyAccessToken(token);
    const currentUser = await User.findById(decoded.id);
    if (currentUser && currentUser.isActive) {
      req.user = currentUser;
    }
  } catch (error) {
    // Invalid/expired token on a public route — just proceed unauthenticated
  }

  next();
});
