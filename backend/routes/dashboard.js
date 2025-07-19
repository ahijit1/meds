// routes/dashboard.js
const express = require('express');
const router = express.Router();

// Mock dashboard data
const mockDashboardData = {
  metrics: {
    totalUsers: 1250,
    activeTickets: 45,
    systemHealth: 98.5,
    dailyLogins: 342
  },
  charts: {
    userActivity: [
      { date: '2025-07-14', users: 320 },
      { date: '2025-07-15', users: 385 },
      { date: '2025-07-16', users: 290 },
      { date: '2025-07-17', users: 420 },
      { date: '2025-07-18', users: 342 }
    ],
    systemPerformance: [
      { time: '00:00', cpu: 45, memory: 62 },
      { time: '06:00', cpu: 52, memory: 68 },
      { time: '12:00', cpu: 78, memory: 85 },
      { time: '18:00', cpu: 65, memory: 72 }
    ]
  }
};

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockDashboardData,
    message: 'Dashboard data retrieved successfully'
  });
});

router.get('/metrics', (req, res) => {
  res.json({
    success: true,
    data: mockDashboardData.metrics,
    message: 'Metrics retrieved successfully'
  });
});

module.exports = router;

// routes/reporting.js
const express = require('express');
const router = express.Router();

const mockReports = [
  {
    id: 1,
    name: 'User Activity Report',
    type: 'user_activity',
    description: 'Weekly user activity summary',
    status: 'completed',
    createdAt: new Date(),
    format: 'PDF'
  },
  {
    id: 2,
    name: 'System Performance Report',
    type: 'system_performance',
    description: 'Monthly system performance metrics',
    status: 'pending',
    createdAt: new Date(),
    format: 'Excel'
  }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockReports,
    message: 'Reports retrieved successfully'
  });
});

router.post('/generate', (req, res) => {
  const { reportType, parameters } = req.body;
  
  const newReport = {
    id: mockReports.length + 1,
    name: `Generated ${reportType} Report`,
    type: reportType,
    description: `Auto-generated report for ${reportType}`,
    status: 'processing',
    createdAt: new Date(),
    format: parameters.format || 'PDF'
  };
  
  mockReports.push(newReport);
  
  res.json({
    success: true,
    data: newReport,
    message: 'Report generation started'
  });
});

module.exports = router;

// routes/logManagement.js
const express = require('express');
const router = express.Router();

const mockLogs = [
  {
    id: 1,
    timestamp: new Date(),
    level: 'INFO',
    service: 'user-service',
    message: 'User login successful',
    userId: 'user123',
    details: { ip: '192.168.1.100', userAgent: 'Mozilla/5.0...' }
  },
  {
    id: 2,
    timestamp: new Date(),
    level: 'ERROR',
    service: 'payment-service',
    message: 'Payment processing failed',
    userId: 'user456',
    details: { error: 'Connection timeout', transactionId: 'tx789' }
  }
];

router.get('/', (req, res) => {
  const { level, service, startDate, endDate } = req.query;
  let filteredLogs = mockLogs;
  
  if (level) {
    filteredLogs = filteredLogs.filter(log => log.level === level);
  }
  
  if (service) {
    filteredLogs = filteredLogs.filter(log => log.service === service);
  }
  
  res.json({
    success: true,
    data: filteredLogs,
    message: 'Logs retrieved successfully'
  });
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const log = mockLogs.find(log => log.id === id);
  
  if (!log) {
    return res.status(404).json({
      success: false,
      message: 'Log entry not found'
    });
  }
  
  res.json({
    success: true,
    data: log,
    message: 'Log details retrieved successfully'
  });
});

module.exports = router;

// routes/ticketing.js
const express = require('express');
const router = express.Router();

let mockTickets = [
  {
    id: 1,
    title: 'System Outage - Payment Service',
    description: 'Payment service is down affecting all transactions',
    type: 'outage',
    priority: 'high',
    status: 'open',
    assignedTo: 'admin@company.com',
    createdBy: 'user@company.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: 'Change Request - Update User Interface',
    description: 'Request to update the user interface design',
    type: 'change_request',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'dev@company.com',
    createdBy: 'pm@company.com',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockTickets,
    message: 'Tickets retrieved successfully'
  });
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ticket = mockTickets.find(ticket => ticket.id === id);
  
  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }
  
  res.json({
    success: true,
    data: ticket,
    message: 'Ticket retrieved successfully'
  });
});

router.post('/', (req, res) => {
  const { title, description, type, priority, assignedTo, createdBy } = req.body;
  
  if (!title || !description || !type) {
    return res.status(400).json({
      success: false,
      message: 'Title, description, and type are required'
    });
  }
  
  const newTicket = {
    id: mockTickets.length + 1,
    title,
    description,
    type,
    priority: priority || 'medium',
    status: 'open',
    assignedTo,
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockTickets.push(newTicket);
  
  res.status(201).json({
    success: true,
    data: newTicket,
    message: 'Ticket created successfully'
  });
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ticketIndex = mockTickets.findIndex(ticket => ticket.id === id);
  
  if (ticketIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }
  
  const { title, description, type, priority, status, assignedTo } = req.body;
  
  mockTickets[ticketIndex] = {
    ...mockTickets[ticketIndex],
    title: title || mockTickets[ticketIndex].title,
    description: description || mockTickets[ticketIndex].description,
    type: type || mockTickets[ticketIndex].type,
    priority: priority || mockTickets[ticketIndex].priority,
    status: status || mockTickets[ticketIndex].status,
    assignedTo: assignedTo || mockTickets[ticketIndex].assignedTo,
    updatedAt: new Date()
  };
  
  res.json({
    success: true,
    data: mockTickets[ticketIndex],
    message: 'Ticket updated successfully'
  });
});

router.patch('/:id/close', (req, res) => {
  const id = parseInt(req.params.id);
  const ticketIndex = mockTickets.findIndex(ticket => ticket.id === id);
  
  if (ticketIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    });
  }
  
  mockTickets[ticketIndex].status = 'closed';
  mockTickets[ticketIndex].updatedAt = new Date();
  
  res.json({
    success: true,
    data: mockTickets[ticketIndex],
    message: 'Ticket closed successfully'
  });
});

module.exports = router;
