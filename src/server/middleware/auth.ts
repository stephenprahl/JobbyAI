import { Elysia } from 'elysia';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .onError(({ error, set }) => {
    logger.error('Auth middleware error:', error);
    set.status = 401;
    return { error: 'Unauthorized' };
  })
  .derive(async (context) => {
    try {
      const authHeader = context.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        context.set.status = 401;
        return { error: 'No token provided' };
      }

      const token = authHeader.split(' ')[1];
      const user = authService.verifyToken(token);
      const isAdmin = user.role === 'ADMIN';
      const isVerified = user.emailVerified;
      
      // Add user info to context
      (context as any).user = user;
      (context as any).isAdmin = isAdmin;
      (context as any).isVerified = isVerified;
      
      return {
        user,
        isAdmin,
        isVerified,
      };
    } catch (error) {
      logger.error('Authentication failed:', error);
      context.set.status = 401;
      return { error: 'Invalid or expired token' };
    }
  });

// Middleware to require admin access
export const adminOnly = (app: Elysia) =>
  app.onBeforeHandle((context) => {
    const user = (context as any).user;
    const isAdmin = (context as any).isAdmin;
    
    if (!user || !isAdmin) {
      context.set.status = 403;
      return { error: 'Forbidden: Admin access required' };
    }
    return undefined;
  });

// Middleware to require email verification
export const verifiedOnly = (app: Elysia) =>
  app.onBeforeHandle((context) => {
    const user = (context as any).user;
    const isVerified = (context as any).isVerified;
    
    if (!user) {
      context.set.status = 401;
      return { error: 'Authentication required' };
    }
    
    if (!isVerified) {
      context.set.status = 403;
      return { 
        error: 'Email verification required',
        code: 'EMAIL_VERIFICATION_REQUIRED',
        verified: false
      };
    }
    return undefined;
  });
