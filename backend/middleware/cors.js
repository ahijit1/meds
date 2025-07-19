// backend/middleware/cors.js
/**
 * CORS middleware configuration
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from these origins
    const allowedOrigins = [
      'http://localhost:4200',  // Angular dev server
      'http://localhost:3000',  // Alternative dev port
      'https://your-production-domain.com'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and credentials
  optionsSuccessStatus: 200, // For legacy browser support
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ]
};

module.exports = corsOptions;
