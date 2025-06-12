import express from 'express';
import { CivicAuth, CookieStorage } from '@civic/auth/server';
import cookieParser from 'cookie-parser';



// Configuration object
const config = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CIVIC_CLIENT_SECRET,
  redirectUri: process.env.CIVIC_REDIRECT_URL,           // ✅ Correct
  postLogoutRedirectUri: process.env.CIVIC_POST_LOGOUT_REDIRECT_URL  // ✅ Correct
}; 
// Custom CookieStorage implementation for Express
class ExpressCookieStorage extends CookieStorage {
  constructor(req, res) {
    super({
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    this.req = req;
    this.res = res;
  }

  async get(key) {
    return Promise.resolve(this.req.cookies[key] ?? null);
  }

  async set(key, value) {
    this.res.cookie(key, value, this.settings);
    return Promise.resolve();
  }
}

// Middleware to attach storage and civicAuth to each request
export const setupCivicAuth = (req, res, next) => {
  try {
    req.storage = new ExpressCookieStorage(req, res);
    req.civicAuth = new CivicAuth(req.storage, config);
    next();
  } catch (error) {
    console.error('Civic Auth setup error:', error);
    next(error);
  }
};

// Authentication middleware
export const requireAuth = async (req, res, next) => {
  try {
    if (!req.civicAuth) {
      console.error('Civic Auth not initialized on request object');
      return res.status(500).json({ 
        success: false, 
        error: 'Authentication system not initialized' 
      });
    }

    const isLoggedIn = await req.civicAuth.isLoggedIn();
    if (!isLoggedIn) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized',
        message: 'User not logged in' 
      });
    }
    
    const civicUser = await req.civicAuth.getUser();
    req.user = civicUser;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Authentication error',
      message: error.message 
    });
  }
};