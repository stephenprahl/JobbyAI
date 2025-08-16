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

// Track DB connectivity for health endpoints
let dbConnected = false;

// Create Elysia app with raw Response-based CORS handling
const app = new Elysia()
  .decorate('prisma', prisma)
  .state('version', '1.0.0')
  // Handle preflight OPTIONS requests with raw Response
  .options('*', ({ request }) => {
    const origin = request.headers.get('origin') || CORS_ORIGIN;
    console.log('🔍 OPTIONS preflight from origin:', origin);

    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': CORS_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
        'X-Debug-CORS': 'Manually-Set-By-Server',
        'Cache-Control': 'no-cache',
        'X-Robots-Tag': 'noindex',
      }
    });
  })
  // Add CORS to regular requests too
  .onRequest(({ request, set }) => {
    // Try setting a bypass header
    set.headers['X-Render-Bypass-CORS'] = 'true';
    set.headers['Access-Control-Allow-Origin'] = CORS_ORIGIN;
    set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    set.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
  })
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    services: {
      database: dbConnected ? 'connected' : 'disconnected',
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
          database: dbConnected ? 'connected' : 'disconnected',
          ai: isGeminiConfigured() ? 'gemini-connected' : 'gemini-not-configured'
        }
      }))
  )
  .all('*', () => ({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found',
  }));

// Connect to database and start server (do not crash if DB is temporarily unavailable)
async function startServer() {
  try {
    logger.info('🔄 Attempting to connect to database...');
    await connect();
    dbConnected = true;
    logger.info('✅ Connected to database');
  } catch (error) {
    dbConnected = false;
    logger.error('❌ Database connection failed:', error);
    // Print full error details for Render logs
    console.error('Full DB connection error details:', error);
    // continue to start the server so health endpoints return status
  }

  try {
    logger.info('➡️ Calling app.listen now...');
    try {
      app.listen(PORT, () => {
        logger.info('⬅️ app.listen callback triggered');
        logger.info(`🚀 Server is running on http://${app.server?.hostname}:${app.server?.port}`);
        logger.info(`📚 API Documentation available at http://${app.server?.hostname}:${app.server?.port}/api/docs`);
        logger.info(`🏥 Health check: http://${app.server?.hostname}:${app.server?.port}/api/health`);
        logger.info(`📋 Resume API: http://${app.server?.hostname}:${app.server?.port}/api/resume`);
        logger.info(`🔐 Auth API: http://${app.server?.hostname}:${app.server?.port}/api/auth`);
      });
      logger.info('✅ app.listen invoked (no immediate throw)');
    } catch (listenError) {
      logger.error('❌ app.listen threw an error:', listenError);
      console.error('app.listen error details:', listenError);
    }

    // Start background attempts to connect to DB without blocking server startup
    attemptDbConnect();
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    console.error('Full error details:', error);
    process.exit(1);
  }
}

startServer();

// Background DB connection attempts with retry/backoff
async function attemptDbConnect(retries = 5, initialDelayMs = 2000) {
  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt < retries && !dbConnected) {
    try {
      attempt += 1;
      logger.info(`🔁 DB connect attempt ${attempt}/${retries}...`);
      await connect();
      dbConnected = true;
      logger.info('✅ Connected to database (background)');
      break;
    } catch (error) {
      logger.warn(`⚠️ DB connect attempt ${attempt} failed: ${error}`);
      console.error('DB connect error details:', error);
      if (attempt >= retries) {
        logger.error('❌ All DB connection attempts failed');
        break;
      }
      // exponential backoff
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2;
    }
  }
}

// Global error handlers (log but do not exit to avoid crash loops on transient issues)
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  console.error('Uncaught Exception details:', error);
  // Do not exit the process; keep running to expose health endpoints for diagnostics
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  console.error('Unhandled Rejection details:', reason);
  // Do not exit the process; keep running to expose health endpoints for diagnostics
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

// Log process exit reasons to assist with Render 'Application exited early' diagnostics
process.on('beforeExit', (code) => {
  logger.warn('Process beforeExit with code:', code);
  console.warn('Process beforeExit with code:', code);
});

process.on('exit', (code) => {
  logger.warn('Process exit with code:', code);
  console.warn('Process exit with code:', code);
});

export { app };
