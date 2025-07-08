import { cors } from '@elysiajs/cors';
import { config } from 'dotenv';
import { Elysia } from 'elysia';
import path from 'path';

// Load environment variables
config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
});

const PORT = parseInt(process.env.PORT || '3001', 10);

const app = new Elysia({
  name: 'resume-plan-ai-backend',
})
  .use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }))
  .get('/api/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))
  .listen(PORT);

console.log(`🚀 Server running at http://localhost:${PORT}`);
console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
