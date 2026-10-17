import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import placementRoutes from './routes/placementRoutes.js';
import alumniRoutes from './routes/alumniRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

export const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // allow frontend to load uploaded resume / avatar previews
  })
);

// CORS configuration
app.use(
  cors({
    origin: [config.CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging
if (config.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads (resumes, logos)
app.use('/uploads', express.static(config.UPLOAD_PATH));

// Rate limiting for auth and general API
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per 15 min
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'campusconnect-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: config.NODE_ENV,
  });
});

// Mount modular REST routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' not found.`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);
