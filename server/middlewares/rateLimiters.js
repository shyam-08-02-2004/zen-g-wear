import rateLimit from 'express-rate-limit';

// Tighter limits on brute-force-prone endpoints than the global API limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts from this IP, please try again in 15 minutes',
  },
});
