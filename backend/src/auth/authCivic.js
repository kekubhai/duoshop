import prisma from '../db/index.js';

import express from 'express';
const router=express.Router();

router.get('/auth/login', async (req, res) => {
  const url = await req.civicAuth.buildLoginUrl();
  res.redirect(url.toString());
});

router.get('/auth/logout', async (req, res) => {
  const url = await req.civicAuth.buildLogoutRedirectUrl();
  res.redirect(url.toString());
});
router.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  await req.civicAuth.resolveOAuthAccessCode(code, state);

  // ✅ Fetch the verified user from Civic
  const civicUser = await req.civicAuth.getUser();

  // 🛠 Upsert into Prisma
  const dbUser = await prisma.user.upsert({
    where: { email: civicUser.email },
    update: { name: civicUser.name },
    create: {
      id: civicUser.sub,      // or generate your own ID
      email: civicUser.email,
      name: civicUser.name,
    },
  });

  
});

// Add this POST endpoint for initiating authentication
 router.post('/auth/login', async (req, res) => {
  try {
    // Get any parameters from request body
    const { redirectTo, scope = ['openid', 'email', 'profile'] } = req.body;
    
    // Build the login URL with optional custom parameters
    const url = await req.civicAuth.buildLoginUrl({
      redirectTo: redirectTo || process.env.CIVIC_DEFAULT_REDIRECT,
      scope
    });
    
    // Instead of redirecting, return the URL for the client to handle
    res.json({ 
      success: true,
      authUrl: url.toString(),
      message: 'Authentication URL generated successfully'
    });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate authentication URL',
      message: error.message
    });
  }
});

// Add a user creation/update endpoint that works with Civic Auth
router.post('/auth/user', async (req, res) => {
  try {
    // Check if user is authenticated with Civic
    if (!(await req.civicAuth.isLoggedIn())) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized',
        message: 'User must be authenticated with Civic' 
      });
    }
    
    // Get the authenticated user from Civic
    const civicUser = await req.civicAuth.getUser();
    
    // Get additional data from request body
    const { additionalData = {} } = req.body;
    
    // Create or update user in database
    const dbUser = await prisma.user.upsert({
      where: { email: civicUser.email },
      update: { 
        name: civicUser.name,
        ...additionalData
      },
      create: {
        id: civicUser.sub,
        email: civicUser.email,
        name: civicUser.name,
        ...additionalData
      },
    });
    
    res.json({ 
      success: true, 
      user: dbUser,
      message: 'User created/updated successfully' 
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create/update user',
      message: error.message
    });
  }
});

// Add this endpoint to check authentication status
router.get('/auth/status', async (req, res) => {
  try {
    const isAuthenticated = await req.civicAuth.isLoggedIn();
    
    if (isAuthenticated) {
      const user = await req.civicAuth.getUser();
      res.json({ 
        authenticated: true, 
        user 
      });
    } else {
      res.json({ 
        authenticated: false 
      });
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).json({ 
      error: 'Failed to check authentication status',
      message: error.message
    });
  }
});

export default router;
