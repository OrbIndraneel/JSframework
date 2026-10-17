import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().optional(),
  JWT_SECRET: z.string().default('campusconnect_jwt_secret_dev_key_super_secure_9922'),
  JWT_REFRESH_SECRET: z.string().default('campusconnect_jwt_refresh_secret_dev_key_8833'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('2h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  FASTAPI_SERVICE_URL: z.string().default('http://localhost:8000/api/v1'),
  UPLOAD_DIR: z.string().default('uploads/resumes'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = {
  ...parsed.data,
  PORT: parseInt(parsed.data.PORT, 10),
  UPLOAD_PATH: path.resolve(process.cwd(), parsed.data.UPLOAD_DIR),
};
