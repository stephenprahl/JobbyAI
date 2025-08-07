import { cors } from '@elysiajs/cors';
import { config } from 'dotenv';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import { analysisPrismaRoutes } from './routes/analysis.prisma';
import { analyticsRoutes } from './routes/analytics.routes';
import { authRoutes } from './routes/auth.routes';
import { careerDevelopmentRoutes } from './routes/careerDevelopment.routes';
import { chatRoutes } from './routes/chat.routes';
import { interviewRoutes } from './routes/interview.routes';
import { jobRecommendationsRoutes } from './routes/jobRecommendations.routes';
import { resumeRoutes } from './routes/resume.routes';
import { scamTrackerRoutes } from './routes/scamTracker.routes';
// import { salaryNegotiationRoutes } from './routes/salaryNegotiation.routes';
import { subscriptionRoutes } from './routes/subscription.routes';
import { userRoutes } from './routes/user.routes';
import { isGeminiConfigured } from './services/gemini';
import prisma, { connect, disconnect } from './services/prisma.service';


const { Elysia } = require('elysia');

// Load environment variables
config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
});
config(); // Also load .env file

const PORT = parseInt(process.env.PORT || '3001', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

console.log('🔧 Environment Configuration:');
console.log('- NODE_ENV:', NODE_ENV);
console.log('- PORT:', PORT);
console.log('- CORS_ORIGIN:', CORS_ORIGIN);

// Configure logger
const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'resume-plan-ai-backend' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

console.log('Starting full Elysia server...');

// Create Elysia app with minimal middleware first
const app = new Elysia()
  .decorate('prisma', prisma)
  .state('version', '1.0.0')
  .use(cors({
    origin: ['https://jobby-ai-lovat.vercel.app/', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  }))
  .onBeforeHandle(({ set }) => {
    // Add CORS headers manually as backup
    set.headers['Access-Control-Allow-Origin'] = '*'
    set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    set.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
  })
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    services: {
      database: 'connected',
      ai: isGeminiConfigured() ? 'gemini-connected' : 'gemini-not-configured'
    }
  }))
  // Group all API routes under /api prefix
  .group('/api', (api) =>
    api
      .use(resumeRoutes)
      .use(authRoutes)
      .use(analysisPrismaRoutes)
      .use(userRoutes)
      .use(subscriptionRoutes)
      .use(analyticsRoutes)
      .use(jobRecommendationsRoutes)
      .use(interviewRoutes)
      .use(careerDevelopmentRoutes)
      .use(scamTrackerRoutes)
      .use(chatRoutes)
      // .use(salaryNegotiationRoutes)
      .get('/health', () => ({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        services: {
          database: 'connected',
          ai: isGeminiConfigured() ? 'gemini-connected' : 'gemini-not-configured'
        }
      }))
  )
  .all('*', () => ({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found',
  }));

// Connect to database and start server
async function startServer() {
  try {
    logger.info('🔄 Attempting to connect to database...');
    await connect();
    logger.info('✅ Connected to database');

    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://${app.server?.hostname}:${app.server?.port}`);
      logger.info(`📚 API Documentation available at http://${app.server?.hostname}:${app.server?.port}/api/docs`);
      logger.info(`🏥 Health check: http://${app.server?.hostname}:${app.server?.port}/api/health`);
      logger.info(`📋 Resume API: http://${app.server?.hostname}:${app.server?.port}/api/resume`);
      logger.info(`🔐 Auth API: http://${app.server?.hostname}:${app.server?.port}/api/auth`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    console.error('Full error details:', error);
    process.exit(1);
  }
}

startServer();

// Global error handlers
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  console.error('Uncaught Exception details:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  console.error('Unhandled Rejection details:', reason);
  process.exit(1);
});

// Handle graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down server...');

  try {
    await disconnect();
    await app.stop();
    logger.info('Server has been shut down');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { app };
