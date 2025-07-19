// backend/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
const { logger } = require('./logger');

/**
 * General API rate limiting
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
      ip: req.ip,
      url: req.url,
      userAgent: req.get('User-Agent')
    });
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: 15 * 60
    });
  }
});

/**
 * Strict rate limiting for authentication endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`, {
      ip: req.ip,
      url: req.url,
      userAgent: req.get('User-Agent')
    });
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.',
      retryAfter: 15 * 60
    });
  }
});

/**
 * More lenient rate limiting for dashboard/reporting endpoints
 */
const dashboardLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: {
    success: false,
    message: 'Too many dashboard requests, please slow down.',
    retryAfter: 60
  }
});

/**
 * Rate limiting for file uploads
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    success: false,
    message: 'Too many file uploads, please try again later.',
    retryAfter: 60 * 60
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  dashboardLimiter,
  uploadLimiter
};
