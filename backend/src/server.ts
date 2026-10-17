import { app } from './app.js';
import { config } from './config/index.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.PORT, () => {
      console.log(`=======================================================`);
      console.log(` CampusConnect Backend Service Live`);
      console.log(` URL: http://localhost:${config.PORT}`);
      console.log(` Environment: ${config.NODE_ENV}`);
      console.log(` Health: http://localhost:${config.PORT}/api/health`);
      console.log(` FastAPI Target: ${config.FASTAPI_SERVICE_URL}`);
      console.log(`=======================================================`);
    });

    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err: any) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
