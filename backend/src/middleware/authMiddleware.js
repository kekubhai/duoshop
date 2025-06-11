import express from 'express';

export const requireAuth = async (req, res, next) => {
  try {
    if (!(await req.CivicAuth.isLoggedIn())) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized',
        message: 'Authentication required' 
      });
    }
    
    // Add user to request object for easy access in route handlers
    const civicUser = await req.CivicAuth.getUser();
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