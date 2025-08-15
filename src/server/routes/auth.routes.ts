const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post(
    '/register',
    async ({ body, set }) => {
      try {
        const { email, password } = body;
        const result = await authService.register(email, password);
        return result;
      } catch (error: any) {
        logger.error('Registration failed:', error);
        set.status = 400;
        return {
          success: false,
          error: error.message || 'Registration failed'
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8 }),
      }),
      detail: {
        tags: ['Authentication'],
        description: 'Register a new user',
        responses: {
          200: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        // firstName/lastName removed from registration response
                        role: { type: 'string' },
                      },
                    },
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Registration failed',
          },
        },
      },
    }
  )
  .post(
    '/login',
    async ({ body, set }) => {
      try {
        const { email, password } = body;
        const result = await authService.login(email, password);
        return result;
      } catch (error: any) {
        logger.error('Login failed:', error);
        set.status = 401;
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
      detail: {
        tags: ['Authentication'],
        description: 'Login user',
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        firstName: { type: 'string', nullable: true },
                        lastName: { type: 'string', nullable: true },
                        role: { type: 'string' },
                      },
                    },
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
          },
        },
      },
    }
  )
  .get(
    '/me',
    async ({ headers, set }) => {
      try {
        const authHeader = headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          set.status = 401;
          return {
            success: false,
            error: 'Authorization header required'
          };
        }

        const token = authHeader.substring(7);
        const user = await authService.getCurrentUser(token);

        return {
          success: true,
          data: user
        };
      } catch (error: any) {
        logger.error('Get current user failed:', error);
        set.status = 401;
        return {
          success: false,
          error: error.message || 'Unauthorized'
        };
      }
    },
    {
      detail: {
        tags: ['Authentication'],
        description: 'Get current user information',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        firstName: { type: 'string', nullable: true },
                        lastName: { type: 'string', nullable: true },
                        role: { type: 'string' },
                        emailVerified: { type: 'boolean' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Invalid or missing token',
          },
        },
      },
    }
  );
