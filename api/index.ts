import { connect } from '../src/server/services/prisma.service';
import { authRoutes } from '../src/server/routes/auth.routes';
import { resumeRoutes } from '../src/server/routes/resume.routes';

const { Elysia } = require('elysia');

// Create simple Elysia app for Vercel
const app = new Elysia()
  .onRequest(({ set }) => {
    // Set CORS headers for all requests
    set.headers['Access-Control-Allow-Origin'] = '*';
    set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    set.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
    set.headers['Access-Control-Allow-Credentials'] = 'true';
  })
  .options('*', () => {
    return new Response(null, { status: 204 });
  })
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    platform: 'vercel'
  }))
  .use(authRoutes)
  .use(resumeRoutes);

// Initialize database connection
connect().catch(console.error);

export default app.handle;
