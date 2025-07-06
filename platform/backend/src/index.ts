import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { rateLimit } from './middleware/rateLimiter';
import { swagger } from '@elysiajs/swagger';
import { createLogger, format, transports } from 'winston';
import { config } from 'dotenv';
import path from 'path';
import { prismaService } from './services/prisma.service';
import { errorHandler } from './middleware/error';
import { analysisPrismaRoutes } from './routes/analysis.prisma';

// Load environment variables
config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
});

// Get environment variables
const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

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

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Create Elysia app with proper typing
const app = new Elysia({
  name: 'resume-plan-ai-backend',
  serve: {
    port: PORT,
    hostname: isProduction ? '0.0.0.0' : 'localhost'
  },
  prefix: '/api',
})
  // Add Prisma context
  .decorate('prisma', prismaService.getClient())
  .state('version', '1.0.0')
  // Add global error handler
  .use(errorHandler)
  // Add CORS
  .use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }))
  // Add rate limiting
  .use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }))
  // Add Swagger documentation
  .use(swagger({
    path: '/docs',
    documentation: {
      info: {
        title: 'Resume Plan AI API',
        version: '1.0.0',
        description: 'API for Resume Plan AI',
      },
      tags: [
        { name: 'Analysis', description: 'Job analysis endpoints' },
      ],
    },
  }))
  // Add routes
  .use(analysisPrismaRoutes)
  // Health check endpoint
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))
  // 404 handler
  .all('*', () => ({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found',
  }));

// Connect to database
prismaService.connect()
  .then(() => {
    logger.info('✅ Connected to database');
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://${app.server?.hostname}:${app.server?.port}`);
      logger.info(`📚 API Documentation available at http://${app.server?.hostname}:${app.server?.port}/api/docs`);
    });
  })
  .catch((error) => {
    logger.error('❌ Failed to connect to database:', error);
    process.exit(1);
  });

// Handle graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down server...');
  
  try {
    // Close the Prisma client
    await prismaService.disconnect();
    
    // Close the server
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
