import app from './app';
import { config } from './config/app.config';
import { connectDB } from './config/database.config';

const startServer = async (retryCount = 0) => {
  try {
    // Connect to MongoDB with retry
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📝 API Documentation: http://localhost:${config.port}/api-docs`);
    });

    // Graceful shutdown with timeout
    const gracefulShutdown = async (signal: string) => {
      console.log(`👋 ${signal} received. Starting graceful shutdown...`);
      
      // Give existing connections 10 seconds to complete
      server.close(() => {
        console.log('💥 Server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('⚠️ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Handle various termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled rejections with retry
    process.on('unhandledRejection', (err: Error) => {
      console.error('❌ UNHANDLED REJECTION!');
      console.error(err.name, err.message);
      
      if (retryCount < config.retry.maxAttempts) {
        console.log(`🔄 Retrying server startup (${retryCount + 1}/${config.retry.maxAttempts})...`);
        setTimeout(() => {
          startServer(retryCount + 1);
        }, config.retry.delay);
      } else {
        console.error('❌ Max retries reached. Shutting down...');
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Error starting server:', error);
    
    if (retryCount < config.retry.maxAttempts) {
      console.log(`🔄 Retrying server startup (${retryCount + 1}/${config.retry.maxAttempts})...`);
      setTimeout(() => {
        startServer(retryCount + 1);
      }, config.retry.delay);
    } else {
      console.error('❌ Max retries reached. Shutting down...');
      process.exit(1);
    }
  }
};

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});