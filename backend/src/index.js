import express from 'express';
import cookieParser from 'cookie-parser';
import prisma from './db/index.js';
import { setupCivicAuth, requireAuth } from './middleware/authMiddleware.js';
import transactionsRoute from './routes/transactionsRoute.js';
import authCivicRouter from './auth/authCivic.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Apply Civic Auth setup middleware BEFORE requireAuth
app.use(setupCivicAuth);

// Welcome route - no auth required
app.get('/', (req, res) => {
    console.log("Server is running");
    res.send("Welcome to the Expense Tracker API");
});

// Auth routes - no auth required
app.use('/', authCivicRouter);

// Protected API routes - apply requireAuth
app.use('/api/transactions', requireAuth, transactionsRoute);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});