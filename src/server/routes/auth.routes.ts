import { Elysia, t } from 'elysia';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

export const authRoutes = (app: Elysia) =>
  app.group('/auth', (app) =>
    app
      .post(
        '/register',
        async ({ body, set }) => {
          try {
            const { email, password, firstName, lastName } = body;
            const result = await authService.register(email, password, firstName, lastName);
            return result;
          } catch (error: any) {
            logger.error('Registration failed:', error);
            set.status = 400;
            return { error: error.message || 'Registration failed' };
          }
        },
        {
          body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String({ minLength: 8 }),
            firstName: t.Optional(t.String()),
            lastName: t.Optional(t.String()),
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
            return { error: 'Invalid email or password' };
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
  );
