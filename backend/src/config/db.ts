import 'dotenv/config';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<string> => {
  const uri = process.env.MONGODB_URI;

  if (uri && process.env.NODE_ENV !== 'test') {
    try {
      console.log(`Attempting connection to configured MongoDB: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
      console.log('Successfully connected to MongoDB database.');
      return uri;
    } catch (err: any) {
      console.warn(`Configured MongoDB connection failed: ${err.message}. Falling back to in-memory instance for development/testing.`);
    }
  }

  // Fallback to MongoMemoryServer for tests or when no remote DB is available
  try {
    if (!memoryServer) {
      memoryServer = await MongoMemoryServer.create();
    }
    const memUri = memoryServer.getUri();
    console.log(`Starting in-memory MongoDB at ${memUri}`);
    await mongoose.connect(memUri);
    console.log('Connected to embedded in-memory MongoDB.');
    return memUri;
  } catch (err: any) {
    console.error('Fatal: Failed to start in-memory MongoDB:', err.message);
    throw err;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

