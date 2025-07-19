const crypto = require('crypto');

/**
 * Helper functions for the portal platform
 */

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Format date to ISO string
const formatDate = (date) => {
  return new Date(date).toISOString();
};

// Sanitize input string
const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate pagination metadata
const generatePagination = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems: total,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    offset
  };
};

// Success response helper
const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

// Error response helper
const errorResponse = (message = 'Error occurred', statusCode = 500) => {
  return {
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString()
  };
};

// Convert object to query string
const objectToQueryString = (obj) => {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
};

// Deep clone object
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Generate slug from string
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

module.exports = {
  generateRandomString,
  formatDate,
  sanitizeString,
  isValidEmail,
  generatePagination,
  successResponse,
  errorResponse,
  objectToQueryString,
  deepClone,
  isEmpty,
  generateSlug
};
