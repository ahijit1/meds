const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes for different modules
const masterDataRoutes = require('./routes/masterData');
const dashboardRoutes = require('./routes/dashboard');
const reportingRoutes = require('./routes/reporting');
const logManagementRoutes = require('./routes/logManagement');
const ticketingRoutes = require('./routes/ticketing');

// API Routes
app.use('/api/master-data', masterDataRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reporting', reportingRoutes);
app.use('/api/log-management', logManagementRoutes);
app.use('/api/ticketing', ticketingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portal Platform API is running' });
});

// Serve Angular app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Portal Platform server running on port ${PORT}`);
});

module.exports = app;
