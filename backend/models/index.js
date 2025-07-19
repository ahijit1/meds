// backend/models/index.js
const { Pool } = require('pg');
const { logger } = require('../middleware/logger');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    logger.info('Database connected successfully');
    client.release();
  } catch (err) {
    logger.error('Database connection failed:', err);
    throw err;
  }
};

// User model
const User = {
  async create(userData) {
    const { name, email, password, role = 'user' } = userData;
    const query = `
      INSERT INTO users (name, email, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, name, email, role, created_at
    `;
    const result = await pool.query(query, [name, email, password, role]);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async findById(id) {
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async update(id, userData) {
    const { name, email, role } = userData;
    const query = `
      UPDATE users 
      SET name = $1, email = $2, role = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, email, role, updated_at
    `;
    const result = await pool.query(query, [name, email, role, id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
  }
};

// Master Data model
const MasterData = {
  async create(data) {
    const { name, type, description, status = 'active', metadata = {} } = data;
    const query = `
      INSERT INTO master_data (name, type, description, status, metadata, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [name, type, description, status, JSON.stringify(metadata)]);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM master_data WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (filters.type) {
      paramCount++;
      query += ` AND type = ${paramCount}`;
      params.push(filters.type);
    }

    if (filters.status) {
      paramCount++;
      query += ` AND status = ${paramCount}`;
      params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';
    
    if (filters.limit) {
      paramCount++;
      query += ` LIMIT ${paramCount}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM master_data WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const { name, type, description, status, metadata } = data;
    const query = `
      UPDATE master_data 
      SET name = $1, type = $2, description = $3, status = $4, metadata = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;
    const result = await pool.query(query, [name, type, description, status, JSON.stringify(metadata), id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM master_data WHERE id = $1';
    await pool.query(query, [id]);
  }
};

// Ticket model
const Ticket = {
  async create(ticketData) {
    const { title, description, priority, category, status = 'open', assignee_id, reporter_id } = ticketData;
    const query = `
      INSERT INTO tickets (title, description, priority, category, status, assignee_id, reporter_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [title, description, priority, category, status, assignee_id, reporter_id]);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = `
      SELECT t.*, 
             u1.name as assignee_name, 
             u2.name as reporter_name 
      FROM tickets t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.reporter_id = u2.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (filters.status) {
      paramCount++;
      query += ` AND t.status = ${paramCount}`;
      params.push(filters.status);
    }

    if (filters.priority) {
      paramCount++;
      query += ` AND t.priority = ${paramCount}`;
      params.push(filters.priority);
    }

    if (filters.assignee_id) {
      paramCount++;
      query += ` AND t.assignee_id = ${paramCount}`;
      params.push(filters.assignee_id);
    }

    query += ' ORDER BY t.created_at DESC';
    
    if (filters.limit) {
      paramCount++;
      query += ` LIMIT ${paramCount}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const query = `
      SELECT t.*, 
             u1.name as assignee_name, 
             u2.name as reporter_name 
      FROM tickets t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.reporter_id = u2.id
      WHERE t.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async update(id, ticketData) {
    const { title, description, priority, category, status, assignee_id } = ticketData;
    const query = `
      UPDATE tickets 
      SET title = $1, description = $2, priority = $3, category = $4, status = $5, assignee_id = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [title, description, priority, category, status, assignee_id, id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM tickets WHERE id = $1';
    await pool.query(query, [id]);
  }
};

// Log model
const Log = {
  async create(logData) {
    const { level, message, metadata = {}, source = 'system' } = logData;
    const query = `
      INSERT INTO logs (level, message, metadata, source, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [level, message, JSON.stringify(metadata), source]);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM logs WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (filters.level) {
      paramCount++;
      query += ` AND level = ${paramCount}`;
      params.push(filters.level);
    }

    if (filters.source) {
      paramCount++;
      query += ` AND source = ${paramCount}`;
      params.push(filters.source);
    }

    if (filters.startDate) {
      paramCount++;
      query += ` AND created_at >= ${paramCount}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      paramCount++;
      query += ` AND created_at <= ${paramCount}`;
      params.push(filters.endDate);
    }

    if (filters.search) {
      paramCount++;
      query += ` AND message ILIKE ${paramCount}`;
      params.push(`%${filters.search}%`);
    }

    query += ' ORDER BY created_at DESC';
    
    if (filters.limit) {
      paramCount++;
      query += ` LIMIT ${paramCount}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }
};

// Report model
const Report = {
  async create(reportData) {
    const { name, type, parameters = {}, status = 'pending', generated_by } = reportData;
    const query = `
      INSERT INTO reports (name, type, parameters, status, generated_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [name, type, JSON.stringify(parameters), status, generated_by]);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = `
      SELECT r.*, u.name as generator_name 
      FROM reports r
      LEFT JOIN users u ON r.generated_by = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (filters.type) {
      paramCount++;
      query += ` AND r.type = ${paramCount}`;
      params.push(filters.type);
    }

    if (filters.status) {
      paramCount++;
      query += ` AND r.status = ${paramCount}`;
      params.push(filters.status);
    }

    query += ' ORDER BY r.created_at DESC';
    
    if (filters.limit) {
      paramCount++;
      query += ` LIMIT ${paramCount}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const query = `
      SELECT r.*, u.name as generator_name 
      FROM reports r
      LEFT JOIN users u ON r.generated_by = u.id
      WHERE r.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async update(id, reportData) {
    const { status, file_path, error_message } = reportData;
    const query = `
      UPDATE reports 
      SET status = $1, file_path = $2, error_message = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [status, file_path, error_message, id]);
    return result.rows[0];
  }
};

module.exports = {
  pool,
  testConnection,
  User,
  MasterData,
  Ticket,
  Log,
  Report
};
