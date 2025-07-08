import { cors } from '@elysiajs/cors';
import { config } from 'dotenv';
import { Elysia } from 'elysia';
import path from 'path';
import { authRoutes } from './routes/auth.routes';
import { resumeRoutes } from './routes/resume.routes';
import prisma, { connect, disconnect } from './services/prisma.service';

// Load environment variables
config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
});

const PORT = parseInt(process.env.PORT || '3001', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('Starting server with routes...');

// Create Elysia app with routes
const app = new Elysia({
  name: 'resume-plan-ai-backend',
})
  .decorate('prisma', prisma)
  .use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }))
  .get('/api/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  }))
  // Add routes
  .use(resumeRoutes)
  .use(authRoutes)
  .listen(PORT);

// Connect to database
connect()
  .then(() => {
    console.log('✅ Connected to database');
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📋 Resume API: http://localhost:${PORT}/api/resume`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  });

// Handle graceful shutdown
const shutdown = async () => {
  console.log('Shutting down server...');

  try {
    await disconnect();
    await app.stop();
    console.log('Server has been shut down');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { app };
