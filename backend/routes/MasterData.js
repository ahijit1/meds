const express = require('express');
const router = express.Router();

// Get all master data entities
router.get('/entities', (req, res) => {
  try {
    const entities = [
      {
        id: 'users',
        name: 'Users',
        description: 'User management and profiles',
        recordCount: 1250,
        lastUpdated: new Date('2024-01-18T10:30:00Z')
      },
      {
        id: 'roles',
        name: 'Roles',
        description: 'User roles and permissions',
        recordCount: 15,
        lastUpdated: new Date('2024-01-15T14:20:00Z')
      },
      {
        id: 'departments',
        name: 'Departments',
        description: 'Organizational departments',
        recordCount: 25,
        lastUpdated: new Date('2024-01-10T09:15:00Z')
      },
      {
        id: 'categories',
        name: 'Categories',
        description: 'Item and content categories',
        recordCount: 45,
        lastUpdated: new Date('2024-01-12T16:45:00Z')
      },
      {
        id: 'locations',
        name: 'Locations',
        description: 'Physical and virtual locations',
        recordCount: 85,
        lastUpdated: new Date('2024-01-16T11:30:00Z')
      }
    ];

    res.json({
      success: true,
      data: entities,
      message: 'Master data entities retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving master data entities',
      error: error.message
    });
  }
});

// Get records for a specific entity
router.get('/entities/:entityId/records', (req, res) => {
  try {
    const { entityId } = req.params;
    const { page = 1, limit = 20, search, sortBy, sortOrder = 'asc' } = req.query;

    // Mock data based on entity type
    let records = [];
    
    switch (entityId) {
      case 'users':
        records = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@company.com',
            department: 'Engineering',
            role: 'Senior Developer',
            status: 'active',
            createdAt: new Date('2023-06-15')
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@company.com',
            department: 'Product',
            role: 'Product Manager',
            status: 'active',
            createdAt: new Date('2023-08-20')
          },
          {
            id: 3,
            name: 'Mike Chen',
            email: 'mike.chen@company.com',
            department: 'Engineering',
            role: 'DevOps Engineer',
            status: 'inactive',
            createdAt: new Date('2023-09-10')
          }
        ];
        break;
      
      case 'roles':
        records = [
          {
            id: 1,
            name: 'Administrator',
            description: 'Full system access',
            permissions: ['read', 'write', 'delete', 'admin'],
            userCount: 5
          },
          {
            id: 2,
            name: 'Manager',
            description: 'Management level access',
            permissions: ['read', 'write'],
            userCount: 25
          },
          {
            id: 3,
            name: 'User',
            description: 'Standard user access',
            permissions: ['read'],
            userCount: 220
          }
        ];
        break;
      
      case 'departments':
        records = [
          {
            id: 1,
            name: 'Engineering',
            code: 'ENG',
            manager: 'John Doe',
            employeeCount: 45,
            budget: 2500000,
            location: 'Building A'
          },
          {
            id: 2,
            name: 'Product',
            code: 'PRD',
            manager: 'Jane Smith',
            employeeCount: 15,
            budget: 800000,
            location: 'Building B'
          },
          {
            id: 3,
            name: 'Sales',
            code: 'SAL',
            manager: 'Bob Wilson',
            employeeCount: 30,
            budget: 1200000,
            location: 'Building C'
          }
        ];
        break;
      
      case 'categories':
        records = [
          {
            id: 1,
            name: 'Software',
            parentId: null,
            level: 1,
            itemCount: 125,
            isActive: true
          },
          {
            id: 2,
            name: 'Hardware',
            parentId: null,
            level: 1,
            itemCount: 85,
            isActive: true
          },
          {
            id: 3,
            name: 'Web Development',
            parentId: 1,
            level: 2,
            itemCount: 65,
            isActive: true
          }
        ];
        break;
      
      case 'locations':
        records = [
          {
            id: 1,
            name: 'Headquarters',
            address: '123 Main St, City, State 12345',
            type: 'office',
            capacity: 500,
            isActive: true
          },
          {
            id: 2,
            name: 'Branch Office',
            address: '456 Oak Ave, City, State 67890',
            type: 'office',
            capacity: 100,
            isActive: true
          },
          {
            id: 3,
            name: 'Data Center',
            address: '789 Tech Blvd, City, State 11111',
            type: 'datacenter',
            capacity: 50,
            isActive: true
          }
        ];
        break;
      
      default:
        records = [];
    }

    // Apply search filter
    if (search) {
      records = records.filter(record => 
        Object.values(record).some(value => 
          value && value.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedRecords = records.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        records: paginatedRecords,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: records.length,
          totalPages: Math.ceil(records.length / limit)
        }
      },
      message: `${entityId} records retrieved successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving records',
      error: error.message
    });
  }
});

// Get single record
router.get('/entities/:entityId/records/:recordId', (req, res) => {
  try {
    const { entityId, recordId } = req.params;
    
    // Mock detailed record data
    const record = {
      id: recordId,
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      role: 'Senior Developer',
      status: 'active',
      createdAt: new Date('2023-06-15'),
      updatedAt: new Date('2024-01-18'),
      metadata: {
        createdBy: 'system',
        lastModifiedBy: 'admin@company.com',
        version: 1
      }
    };

    res.json({
      success: true,
      data: record,
      message: 'Record retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving record',
      error: error.message
    });
  }
});

// Create new record
router.post('/entities/:entityId/records', (req, res) => {
  try {
    const { entityId } = req.params;
    const recordData = req.body;

    if (!recordData.name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    const newRecord = {
      id: Date.now(),
      ...recordData,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        createdBy: 'current.user@company.com',
        lastModifiedBy: 'current.user@company.com',
        version: 1
      }
    };

    res.status(201).json({
      success: true,
      data: newRecord,
      message: 'Record created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating record',
      error: error.message
    });
  }
});

// Update record
router.put('/entities/:entityId/records/:recordId', (req, res) => {
  try {
    const { entityId, recordId } = req.params;
    const updates = req.body;

    const updatedRecord = {
      id: recordId,
      ...updates,
      updatedAt: new Date(),
      metadata: {
        createdBy: 'system',
        lastModifiedBy: 'current.user@company.com',
        version: 2
      }
    };

    res.json({
      success: true,
      data: updatedRecord,
      message: 'Record updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating record',
      error: error.message
    });
  }
});

// Delete record
router.delete('/entities/:entityId/records/:recordId', (req, res) => {
  try {
    const { entityId, recordId } = req.params;

    res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting record',
      error: error.message
    });
  }
});

// Bulk operations
router.post('/entities/:entityId/bulk', (req, res) => {
  try {
    const { entityId } = req.params;
    const { operation, recordIds, data } = req.body;

    if (!operation || !recordIds || !Array.isArray(recordIds)) {
      return res.status(400).json({
        success: false,
        message: 'Operation and recordIds are required'
      });
    }

    const result = {
      operation,
      processedCount: recordIds.length,
      successCount: recordIds.length,
      failedCount: 0,
      errors: []
    };

    res.json({
      success: true,
      data: result,
      message: `Bulk ${operation} completed successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error performing bulk operation',
      error: error.message
    });
  }
});

// Import data
router.post('/entities/:entityId/import', (req, res) => {
  try {
    const { entityId } = req.params;
    const { data, format = 'csv' } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Data is required for import'
      });
    }

    const importResult = {
      totalRecords: 100,
      successfulImports: 95,
      failedImports: 5,
      errors: [
        { row: 15, error: 'Invalid email format' },
        { row: 32, error: 'Duplicate entry' },
        { row: 67, error: 'Required field missing' }
      ]
    };

    res.json({
      success: true,
      data: importResult,
      message: 'Data import completed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error importing data',
      error: error.message
    });
  }
});

// Export data
router.get('/entities/:entityId/export', (req, res) => {
  try {
    const { entityId } = req.params;
    const { format = 'csv' } = req.query;

    const exportData = {
      entityId,
      format,
      downloadUrl: `/downloads/${entityId}_export.${format}`,
      generatedAt: new Date(),
      recordCount: 250,
      fileSize: '1.2 MB'
    };

    res.json({
      success: true,
      data: exportData,
      message: `${entityId} data exported successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
});

module.exports = router;
