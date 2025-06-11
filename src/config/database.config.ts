import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from './app.config';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

export const connectDB = async (retryCount = 0): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: config.timeouts.database,
      socketTimeoutMS: config.timeouts.socket,
      family: 4 // Use IPv4, skip trying IPv6
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    if (retryCount < config.retry.maxAttempts) {
      console.log(`🔄 Retrying MongoDB connection (${retryCount + 1}/${config.retry.maxAttempts})...`);
      setTimeout(() => {
        connectDB(retryCount + 1);
      }, config.retry.delay);
    } else {
      console.error('❌ Max retries reached for MongoDB connection');
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
  // Attempt to reconnect
  connectDB();
});

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Mongoose connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during mongoose connection closure:', err);
    process.exit(1);
  }
});
