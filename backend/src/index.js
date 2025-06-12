import express from "express";
import cookieParser from "cookie-parser";
import { CookieStorage, CivicAuth } from "@civic/auth/server";
import prisma from './db/index.js';
import dotenv from "dotenv";

dotenv.config();


const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());
app.use(cookieParser());

// Configure Civic Auth
const config = {

  clientId: process.env.CLIENT_ID,
  redirectUrl: process.env.CIVIC_REDIRECT_URL,
  postLogoutRedirectUrl: process.env.CIVIC_POST_LOGOUT_REDIRECT_URL  // ✅ Correct
};

// Cookie storage implementation
class ExpressCookieStorage extends CookieStorage {
  constructor(req, res) {
    super({
      secure: false,
      sameSite: 'lax',  // Add this to allow cookies in redirects
      maxAge: 60 * 60 * 24  // 24 hours
    });
    this.req = req;
    this.res = res;
  } 

  // Make sure get/set are properly implemented
  async get(key) {
    console.log(`Getting cookie: ${key} = ${this.req.cookies[key]}`);
    return this.req.cookies[key] ?? null;
  }

  async set(key, value) {
    console.log(`Setting cookie: ${key} = ${value.substring(0, 20)}...`);
    this.res.cookie(key, value, this.settings);
  }

  async delete(key) {
    this.res.clearCookie(key);
  }

  async clear() {
    for (const key in this.req.cookies) {
      this.res.clearCookie(key);
    }
  }
}

// Setup middleware
app.use((req,res,next)=>{
  req.storage=new ExpressCookieStorage(req,res)
  req.civicAuth=new CivicAuth(req.storage,config)
  next()
})

// Add this debugging middleware before your auth routes
app.use((req, res, next) => {
  console.log('Cookies:', req.cookies);
  next();
});

// Login route
app.get('/auth/login', async (req, res) => {
  try {
    const url = await req.civicAuth.buildLoginUrl({
      redirectUrl: `${process.env.BASE_URL}/auth/callback`,
      scope: ['openid', 'email', 'profile']
    });
    console.log('Login URL:', url.toString());
    res.redirect(url.toString());
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error initiating login');
  }
});

// Callback route
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  try {
    await req.civicAuth.resolveOAuthAccessCode(code, state);
    
    // Get user info and store in Prisma
    const user = await req.civicAuth.getUser();
    
    // Create or update user in database
    if (user) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: { 
          name: user.name,
          lastLogin: new Date()
        },
        create: {
          id: user.sub,
          email: user.email,
          name: user.name,
        }
      });
    }
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).send('Authentication failed');
  }
});

// Logout route
app.get('/auth/logout', async (req, res) => {
  const url = await req.civicAuth.buildLogoutRedirectUrl();
  res.redirect(url.toString());
});

// Auth middleware
const requireAuth = async (req, res, next) => {
  try {
    if (!(await req.civicAuth.isLoggedIn())) {
      return res.redirect('/auth/login');
    }
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).send('Authentication error');
  }
};

// Protected routes
app.get('/dashboard', requireAuth, async (req, res) => {
  const user = await req.civicAuth.getUser();
  res.send(`Hello, ${user?.name || 'User'}!`);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});