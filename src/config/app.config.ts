import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

export const config = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: '7d' as const, // Using const assertion to ensure type safety
  },
  
  // Google OAuth Configuration
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://lssendangular.vercel.app'] 
      : ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again later',
    handler: (req: any, res: any) => {
      res.status(429).json({
        status: 'error',
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }
  },

  // Server Timeouts
  timeouts: {
    request: 30000, // 30 seconds
    database: 5000, // 5 seconds
    socket: 45000, // 45 seconds
  },

  // Retry Configuration
  retry: {
    maxAttempts: 5,
    delay: 5000, // 5 seconds
  }
};
