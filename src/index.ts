import app from './app';
import { config } from './config/app.config';
import { connectDB } from './config/database.config';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    const server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📝 API Documentation: http://localhost:${config.port}/api-docs`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      console.error('❌ UNHANDLED REJECTION!');
      console.error(err.name, err.message);
      // Don't shut down the server, just log the error
      console.error('Server will continue running...');
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err: Error) => {
      console.error('❌ UNCAUGHT EXCEPTION!');
      console.error(err.name, err.message);
      // Give time for logging before shutting down
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});