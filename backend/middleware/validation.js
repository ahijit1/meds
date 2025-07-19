// backend/middleware/validation.js
const { body, validationResult } = require('express-validator');

/**
 * Handle validation results
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};

/**
 * Common validation rules
 */
const validationRules = {
  // User validation
  createUser: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('role')
      .optional()
      .isIn(['admin', 'user', 'manager'])
      .withMessage('Invalid role specified')
  ],

  // Login validation
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Master data validation
  masterData: [
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name is required and must be at least 2 characters'),
    body('type')
      .isIn(['category', 'status', 'priority', 'department'])
      .withMessage('Invalid type specified'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters')
  ],

  // Ticketing validation
  createTicket: [
    body('title')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Title must be at least 5 characters long'),
    body('description')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters long'),
    body('priority')
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Invalid priority level'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
  ],

  // Report parameters validation
  reportParams: [
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid start date format'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid end date format'),
    body('type')
      .optional()
      .isIn(['summary', 'detailed', 'analytics'])
      .withMessage('Invalid report type')
  ]
};

/**
 * Sanitize input data
 */
const sanitizeInput = (req, res, next) => {
  // Remove any potentially harmful characters
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Basic XSS prevention
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

module.exports = {
  handleValidation,
  validationRules,
  sanitizeInput
};
