const express = require('express');
const router = express.Router();

// Get all logs with pagination and filtering
router.get('/logs', (req, res) => {
  try {
    const { page = 1, limit = 50, level, startDate, endDate, search } = req.query;
    
    // Mock log data
    const logs = [
      {
        id: 1,
        timestamp: new Date('2024-01-18T10:30:00Z'),
        level: 'INFO',
        message: 'User login successful',
        source: 'authentication',
        userId: 'user123',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 2,
        timestamp: new Date('2024-01-18T10:25:00Z'),
        level: 'WARNING',
        message: 'High memory usage detected',
        source: 'system',
        details: { memoryUsage: '85%', threshold: '80%' }
      },
      {
        id: 3,
        timestamp: new Date('2024-01-18T10:20:00Z'),
        level: 'ERROR',
        message: 'Database connection failed',
        source: 'database',
        error: 'Connection timeout after 30s',
        stack: 'Error: Connection timeout...'
      },
      {
        id: 4,
        timestamp: new Date('2024-01-18T10:15:00Z'),
        level: 'DEBUG',
        message: 'Cache hit for user profile',
        source: 'cache',
        userId: 'user456',
        cacheKey: 'profile:user456'
      },
      {
        id: 5,
        timestamp: new Date('2024-01-18T10:10:00Z'),
        level: 'INFO',
        message: 'Report generation completed',
        source: 'reporting',
        reportId: 'rpt_001',
        duration: '2.3s'
      }
    ];

    // Apply filters (simplified for demo)
    let filteredLogs = logs;
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level.toUpperCase());
    }
    if (search) {
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        log.source.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        logs: paginatedLogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredLogs.length,
          totalPages: Math.ceil(filteredLogs.length / limit)
        }
      },
      message: 'Logs retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving logs',
      error: error.message
    });
  }
});

// Get log by ID
router.get('/logs/:id', (req, res) => {
  try {
    const logId = parseInt(req.params.id);
    
    // Mock detailed log data
    const log = {
      id: logId,
      timestamp: new Date('2024-01-18T10:30:00Z'),
      level: 'ERROR',
      message: 'Database connection failed',
      source: 'database',
      error: 'Connection timeout after 30s',
      stack: 'Error: Connection timeout\n    at Database.connect (/app/db.js:45:12)\n    at process.processTicksAndRejections (node:internal/process/task_queues.js:95:5)',
      context: {
        requestId: 'req_123456',
        userId: 'user789',
        sessionId: 'sess_abc123',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        url: '/api/dashboard/data',
        method: 'GET'
      },
      metadata: {
        hostname: 'server-01',
        processId: 12345,
        threadId: 'main'
      }
    };

    res.json({
      success: true,
      data: log,
      message: 'Log details retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving log details',
      error: error.message
    });
  }
});

// Get log levels
router.get('/log-levels', (req, res) => {
  try {
    const logLevels = [
      { value: 'DEBUG', label: 'Debug', color: '#6c757d' },
      { value: 'INFO', label: 'Info', color: '#17a2b8' },
      { value: 'WARNING', label: 'Warning', color: '#ffc107' },
      { value: 'ERROR', label: 'Error', color: '#dc3545' },
      { value: 'CRITICAL', label: 'Critical', color: '#8b0000' }
    ];

    res.json({
      success: true,
      data: logLevels,
      message: 'Log levels retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving log levels',
      error: error.message
    });
  }
});

// Get log sources
router.get('/log-sources', (req, res) => {
  try {
    const sources = [
      { value: 'authentication', label: 'Authentication' },
      { value: 'database', label: 'Database' },
      { value: 'system', label: 'System' },
      { value: 'cache', label: 'Cache' },
      { value: 'reporting', label: 'Reporting' },
      { value: 'api', label: 'API' },
      { value: 'frontend', label: 'Frontend' }
    ];

    res.json({
      success: true,
      data: sources,
      message: 'Log sources retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving log sources',
      error: error.message
    });
  }
});

// Get log statistics
router.get('/logs/stats', (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    // Mock statistics data
    const stats = {
      totalLogs: 15420,
      logsByLevel: {
        DEBUG: 8250,
        INFO: 4830,
        WARNING: 1920,
        ERROR: 380,
        CRITICAL: 40
      },
      logsBySource: {
        system: 6200,
        api: 4100,
        database: 2850,
        authentication: 1450,
        cache: 820
      },
      errorRate: 2.7,
      criticalAlerts: 3,
      period: period
    };

    res.json({
      success: true,
      data: stats,
      message: 'Log statistics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving log statistics',
      error: error.message
    });
  }
});

// Export logs
router.post('/logs/export', (req, res) => {
  try {
    const { format = 'csv', filters = {}, dateRange } = req.body;
    
    // Mock export data
    const exportData = {
      exportId: `export_${Date.now()}`,
      format,
      filters,
      dateRange,
      status: 'processing',
      estimatedCompletion: new Date(Date.now() + 60000), // 1 minute from now
      downloadUrl: null
    };

    res.json({
      success: true,
      data: exportData,
      message: 'Log export started successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting log export',
      error: error.message
    });
  }
});

module.exports = router;
