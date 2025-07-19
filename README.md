# Portal Platform

A comprehensive web application built with Angular and Node.js, featuring master data management, dashboards, reporting, log management, and ticketing systems.

## Architecture Overview

The platform consists of:
- **Master Data Management**: Centralized data management with Spring Boot integration
- **Dashboards**: Real-time data visualization using Grafana
- **Reporting**: Business intelligence reports with Apache Superset and BiRT
- **Log Management**: Centralized logging with Spring Boot backend
- **Ticketing**: Issue tracking with Mantis Bug Tracker integration

## Project Structure

```
portal-platform/
├── backend/                    # Node.js Backend
│   ├── app.js                 # Main server file
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment variables template
│   ├── routes/                # API routes
│   │   ├── masterData.js      # Master data management APIs
│   │   ├── dashboard.js       # Dashboard APIs
│   │   ├── reporting.js       # Reporting APIs
│   │   ├── logManagement.js   # Log management APIs
│   │   └── ticketing.js       # Ticketing system APIs
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # Authentication & authorization
│   │   ├── cors.js           # CORS configuration
│   │   ├── errorHandler.js   # Global error handling
│   │   ├── logger.js         # Request logging
│   │   ├── rateLimit.js      # Rate limiting
│   │   ├── security.js       # Security headers & validation
│   │   └── validation.js     # Input validation
│   └── logs/                 # Application logs
├── frontend/                  # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Feature components
│   │   │   │   ├── master-data/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── reporting/
│   │   │   │   ├── log-management/
│   │   │   │   └── ticketing/
│   │   │   ├── services/
│   │   │   │   └── api.service.ts
│   │   │   └── app-routing.module.ts
│   │   └── assets/
│   ├── angular.json
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)
- PostgreSQL (for database)
- Redis (optional, for session storage)

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration values

5. Start the backend server:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   # or
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Master Data Management
- `GET /api/master-data` - Get all master data
- `POST /api/master-data` - Create master data entry
- `PUT /api/master-data/:id` - Update master data entry
- `DELETE /api/master-data/:id` - Delete master data entry

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/dashboard/charts` - Get chart data

### Reporting
- `GET /api/reports` - Get available reports
- `POST /api/reports/generate` - Generate report
- `GET /api/reports/:id` - Get specific report

### Log Management
- `GET /api/logs` - Get system logs
- `POST /api/logs/search` - Search logs

### Ticketing
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

## Features

### Security
- JWT authentication
- Rate limiting
- CORS protection
- XSS protection
- SQL injection prevention
- Input validation and sanitization
- Security headers with Helmet

### Logging
- Comprehensive request/response logging
- Error tracking
- File-based log rotation
- Console logging for development

### Error Handling
- Global error handling middleware
- Structured error responses
- Development vs production error details

### Validation
- Input validation for all endpoints
- Custom validation rules
- Sanitization of user inputs

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
ng serve --open
```

### Building for Production

Backend:
```bash
cd backend
npm run build
```

Frontend:
```bash
cd frontend
ng build --prod
```

## Environment Variables

Copy `.env.example` to `.env` and configure the following:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `SMTP_*` - Email configuration
- External service URLs for integrations

## Integration Services

The platform integrates with several external services:

1. **Grafana** - For dashboard visualization
2. **Apache Superset** - For advanced reporting
3. **Spring Boot** - For master data and log management
4. **Mantis Bug Tracker** - For ticketing system
5. **BiRT** - For business reporting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
