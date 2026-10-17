import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<string> => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`Attempting connection to configured MongoDB: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log('Successfully connected to MongoDB database.');
      return uri;
    } catch (err) {
      console.warn('Configured MongoDB connection failed. Falling back to in-memory instance for development/testing.');
    }
  }

  // Fallback to MongoMemoryServer for development or standalone environment
  try {
    memoryServer = await MongoMemoryServer.create();
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
  }
};
