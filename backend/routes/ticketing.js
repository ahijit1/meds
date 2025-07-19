const express = require('express');
const router = express.Router();

// Get all tickets
router.get('/tickets', (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, assignee, category } = req.query;
    
    // Mock ticket data
    const tickets = [
      {
        id: 'TKT-001',
        title: 'Dashboard loading issue',
        description: 'Dashboard takes too long to load, timing out after 30 seconds',
        status: 'open',
        priority: 'high',
        category: 'bug',
        assignee: 'john.doe@company.com',
        reporter: 'jane.smith@company.com',
        createdAt: new Date('2024-01-18T09:00:00Z'),
        updatedAt: new Date('2024-01-18T10:30:00Z'),
        dueDate: new Date('2024-01-20T17:00:00Z'),
        tags: ['performance', 'dashboard', 'timeout']
      },
      {
        id: 'TKT-002',
        title: 'Feature request: Dark mode',
        description: 'Add dark mode support to improve user experience',
        status: 'in_progress',
        priority: 'medium',
        category: 'feature',
        assignee: 'alice.johnson@company.com',
        reporter: 'bob.wilson@company.com',
        createdAt: new Date('2024-01-17T14:30:00Z'),
        updatedAt: new Date('2024-01-18T11:00:00Z'),
        dueDate: new Date('2024-01-25T17:00:00Z'),
        tags: ['ui', 'enhancement', 'dark-mode']
      },
      {
        id: 'TKT-003',
        title: 'Database connection errors',
        description: 'Intermittent database connection failures causing system instability',
        status: 'resolved',
        priority: 'critical',
        category: 'bug',
        assignee: 'mike.chen@company.com',
        reporter: 'system@company.com',
        createdAt: new Date('2024-01-16T08:15:00Z'),
        updatedAt: new Date('2024-01-17T16:45:00Z'),
        resolvedAt: new Date('2024-01-17T16:45:00Z'),
        dueDate: new Date('2024-01-16T20:00:00Z'),
        tags: ['database', 'critical', 'infrastructure']
      },
      {
        id: 'TKT-004',
        title: 'User permissions not working',
        description: 'Users unable to access certain features despite having correct permissions',
        status: 'open',
        priority: 'high',
        category: 'bug',
        assignee: null,
        reporter: 'sarah.davis@company.com',
        createdAt: new Date('2024-01-18T11:30:00Z'),
        updatedAt: new Date('2024-01-18T11:30:00Z'),
        dueDate: new Date('2024-01-19T17:00:00Z'),
        tags: ['permissions', 'security', 'access']
      },
      {
        id: 'TKT-005',
        title: 'API documentation update',
        description: 'Update API documentation to reflect recent changes',
        status: 'open',
        priority: 'low',
        category: 'documentation',
        assignee: 'lisa.brown@company.com',
        reporter: 'tech.lead@company.com',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
        dueDate: new Date('2024-01-30T17:00:00Z'),
        tags: ['documentation', 'api', 'maintenance']
      }
    ];

    // Apply filters (simplified for demo)
    let filteredTickets = tickets;
    if (status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }
    if (priority) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
    }
    if (category) {
      filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
    }
    if (assignee) {
      filteredTickets = filteredTickets.filter(ticket => ticket.assignee === assignee);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        tickets: paginatedTickets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredTickets.length,
          totalPages: Math.ceil(filteredTickets.length / limit)
        }
      },
      message: 'Tickets retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving tickets',
      error: error.message
    });
  }
});

// Get ticket by ID
router.get('/tickets/:id', (req, res) => {
  try {
    const ticketId = req.params.id;
    
    // Mock detailed ticket data
    const ticket = {
      id: ticketId,
      title: 'Dashboard loading issue',
      description: 'Dashboard takes too long to load, timing out after 30 seconds. This affects user productivity and experience.',
      status: 'open',
      priority: 'high',
      category: 'bug',
      assignee: 'john.doe@company.com',
      reporter: 'jane.smith@company.com',
      createdAt: new Date('2024-01-18T09:00:00Z'),
      updatedAt: new Date('2024-01-18T10:30:00Z'),
      dueDate: new Date('2024-01-20T17:00:00Z'),
      tags: ['performance', 'dashboard', 'timeout'],
      comments: [
        {
          id: 1,
          author: 'jane.smith@company.com',
          content: 'This issue is affecting multiple users. Please prioritize.',
          createdAt: new Date('2024-01-18T09:15:00Z')
        },
        {
          id: 2,
          author: 'john.doe@company.com',
          content: 'Investigating the issue. It seems to be related to database query performance.',
          createdAt: new Date('2024-01-18T10:30:00Z')
        }
      ],
      attachments: [
        {
          id: 1,
          filename: 'error_screenshot.png',
          size: '245 KB',
          uploadedAt: new Date('2024-01-18T09:30:00Z'),
          url: '/attachments/error_screenshot.png'
        }
      ]
    };

    res.json({
      success: true,
      data: ticket,
      message: 'Ticket details retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving ticket details',
      error: error.message
    });
  }
});

// Create new ticket
router.post('/tickets', (req, res) => {
  try {
    const { title, description, priority, category, assignee, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const newTicket = {
      id: `TKT-${Date.now().toString().slice(-3)}`,
      title,
      description,
      status: 'open',
      priority: priority || 'medium',
      category: category || 'general',
      assignee: assignee || null,
      reporter: 'current.user@company.com', // Should come from auth
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      tags: tags || [],
      comments: [],
      attachments: []
    };

    res.status(201).json({
      success: true,
      data: newTicket,
      message: 'Ticket created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating ticket',
      error: error.message
    });
  }
});

// Update ticket
router.put('/tickets/:id', (req, res) => {
  try {
    const ticketId = req.params.id;
    const updates = req.body;

    // Mock updated ticket
    const updatedTicket = {
      id: ticketId,
      title: updates.title || 'Dashboard loading issue',
      description: updates.description || 'Dashboard takes too long to load...',
      status: updates.status || 'open',
      priority: updates.priority || 'high',
      category: updates.category || 'bug',
      assignee: updates.assignee || 'john.doe@company.com',
      reporter: 'jane.smith@company.com',
      createdAt: new Date('2024-01-18T09:00:00Z'),
      updatedAt: new Date(),
      dueDate: updates.dueDate || new Date('2024-01-20T17:00:00Z'),
      tags: updates.tags || ['performance', 'dashboard', 'timeout']
    };

    res.json({
      success: true,
      data: updatedTicket,
      message: 'Ticket updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating ticket',
      error: error.message
    });
  }
});

// Add comment to ticket
router.post('/tickets/:id/comments', (req, res) => {
  try {
    const ticketId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const newComment = {
      id: Date.now(),
      author: 'current.user@company.com',
      content,
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      data: newComment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

// Get ticket statistics
router.get('/tickets/stats', (req, res) => {
  try {
    const stats = {
      totalTickets: 25,
      openTickets: 12,
      inProgressTickets: 8,
      resolvedTickets: 5,
      ticketsByPriority: {
        low: 6,
        medium: 10,
        high: 7,
        critical: 2
      },
      ticketsByCategory: {
        bug: 12,
        feature: 8,
        documentation: 3,
        support: 2
      },
      avgResolutionTime: '2.5 days',
      overdueTickets: 3
    };

    res.json({
      success: true,
      data: stats,
      message: 'Ticket statistics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving ticket statistics',
      error: error.message
    });
  }
});

module.exports = router;
