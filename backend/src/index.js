import express from 'express';
import cookieParser from 'cookie-parser';
import prisma from './db/index.js';
import {CookieStorage, CivicAuth} from '@civic/auth/server';
import { requireAuth } from './middleware/authMiddleware.js';
import transactionsRoute from './routes/transactionsRoute.js';
import authCivicRouter from './auth/authCivic.js'; // Import the auth router

const app = express();
app.use(express.json()); // Add this to parse JSON request bodies
app.use(cookieParser());

const civicConfig = {
    clientId: process.env.CIVIC_CLIENT_ID,
    clientSecret: process.env.CIVIC_CLIENT_SECRET,
    redirectUri: process.env.CIVIC_REDIRECT_URI,
    postLogoutRedirectUri: process.env.CIVIC_POST_LOGOUT_REDIRECT_URI,
    storage: new CookieStorage({
        cookieName: 'civic_auth',
        maxAge: 60 * 60 * 24 * 30 // 30 days
    })
};

class ExpressCookieStorage extends CookieStorage {
    constructor(req, res) {
        super({secure: process.env.NODE_ENV === 'production'});
        this.req = req;
        this.res = res;
    }
    
    async get(key) {
        return this.req.cookies[key] ?? null;
    }
    
    async set(key, value) {
        this.res.cookie(key, value, this.settings);
    }
}

// Add Civic Auth middleware (only need this once)
app.use((req, res, next) => {
    req.storage = new ExpressCookieStorage(req, res);
    req.CivicAuth = new CivicAuth(req.storage, civicConfig);
    next();
});

// Welcome route
app.get('/', (req, res) => {
    console.log("Server is running");
    res.send("Welcome to the Expense Tracker API");
});

// Mount the auth router - use the routes from authCivic.js
app.use('/', authCivicRouter);

// Protected API routes
app.use('/api/transactions', requireAuth, transactionsRoute);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});