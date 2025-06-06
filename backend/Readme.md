# DuoShop Backend - Expense Tracker API

A robust Node.js backend API for the DuoShop expense tracker application, handling transaction data storage, processing, and authentication.

## System Architecture

![System Architecture](https://via.placeholder.com/800x400?text=DuoShop+System+Architecture)

### Architecture Overview

The DuoShop backend follows a layered architecture:

1. **API Layer** - Express.js routes handling HTTP requests
2. **Controller Layer** - Business logic for handling transactions
3. **Database Layer** - PostgreSQL with Neon for data persistence
4. **Authentication Layer** - Clerk integration for user management

## Technology Stack

- **Runtime**: Node.js
- **API Framework**: Express.js
- **Database**: PostgreSQL (Neon serverless)
- **Query Builder**: PostgreSQL.js
- **Authentication**: Clerk
- **Caching**: Upstash Redis (optional)

## API Endpoints

The backend is deployed on Render.com with the following specifications:
- **Type**: Web Service
- **Environment**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Auto-Deploy**: Enabled

## Development

### Prerequisites
- Node.js v14+
- npm or yarn
- PostgreSQL database access

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/duoshop.git

# Navigate to backend directory
cd duoshop/backend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Performance Considerations

1. **Connection Pooling**: Implemented for database operations
2. **Query Optimization**: Used indexes on frequently queried columns
3. **Error Handling**: Comprehensive error catching and logging
4. **Input Validation**: Server-side validation for all inputs

---

© 2025 DuoShop | Created with Express.js and PostgreSQL