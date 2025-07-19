// backend/middleware/security.js
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

/**
 * Security middleware configuration
 */
const securityConfig = {
  // Helmet configuration for security headers
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false
  }),

  // HTTP Parameter Pollution protection
  hpp: hpp({
    whitelist: ['sort', 'fields', 'page', 'limit', 'filter']
  }),

  // XSS Clean
  xss: xss(),

  // NoSQL Injection protection
  mongoSanitize: mongoSanitize()
};

/**
 * API Key validation middleware
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];

  // Skip API key validation in development
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key required'
    });
  }

  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }

  next();
};

/**
 * IP Whitelist middleware
 */
const ipWhitelist = (whitelist = []) => {
  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    
    // Skip in development
    if (process.env.NODE_ENV === 'development') {
      return next();
    }

    if (whitelist.length === 0) {
      return next();
    }

    if (!whitelist.includes(clientIp)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied from this IP address'
      });
    }

    next();
  };
};

/**
 * Content Type validation
 */
const validateContentType = (allowedTypes = ['application/json']) => {
  return (req, res, next) => {
    if (['GET', 'DELETE'].includes(req.method)) {
      return next();
    }

    const contentType = req.headers['content-type'];
    
    if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
      return res.status(415).json({
        success: false,
        message: 'Unsupported content type',
        allowedTypes
      });
    }

    next();
  };
};

module.exports = {
  securityConfig,
  validateApiKey,
  ipWhitelist,
  validateContentType
};
