import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/app.config';
import { errorHandler } from './middleware/error.middleware';
import { userRoutes } from './module/user/user.route';
import { cryptoRoutes } from './module/crypto/crypto.route';
import { transactionRoutes } from './module/transaction/transaction.route';
import { adminRoutes } from './module/admin/admin.route';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(config.cors));

// Add timeout middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(config.timeouts.request);
  res.setTimeout(config.timeouts.request);
  next();
});

// Add request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the API',
    version: '1.0.0',
  });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized access'
    });
  }
  
  errorHandler(err, req, res, next);
});

// 404 handler - must be last
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default app;