import { Elysia } from 'elysia';
import { z } from 'zod';
import { passwordService } from '../services/password.service';
import { logger } from '../utils/logger';

const requestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

interface RequestResetBody {
  email: string;
}

interface ResetPasswordBody {
  token: string;
  password: string;
}

export const passwordRoutes = new Elysia({ prefix: '/password' })
  // Request password reset
  .post(
    '/request-reset',
    async ({ body, set }) => {
      try {
        const { email } = body as RequestResetBody;
        await passwordService.requestPasswordReset(email);
        
        // Always return success to prevent email enumeration
        return { 
          success: true, 
          message: 'If an account with this email exists, a password reset link has been sent.' 
        };
      } catch (error) {
        logger.error('Error requesting password reset:', error);
        set.status = 500;
        return { 
          success: false, 
          error: 'Failed to process password reset request' 
        };
      }
    },
    {
      body: requestPasswordResetSchema as any,
      detail: {
        tags: ['auth'],
        description: 'Request a password reset email',
        responses: {
          200: {
            description: 'Password reset email sent if account exists',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    }
  )
  
  // Reset password with token
  .post(
    '/reset',
    async ({ body, set }) => {
      try {
        const { token, password } = body as ResetPasswordBody;
        
        // Validate token first
        const isValid = await passwordService.validateResetToken(token);
        if (!isValid) {
          set.status = 400;
          return { 
            success: false, 
            error: 'Invalid or expired password reset token' 
          };
        }
        
        // Hash the new password and reset it
        const hashedPassword = await Bun.password.hash(password);
        await passwordService.resetPassword(token, hashedPassword);
        
        return { 
          success: true, 
          message: 'Password has been successfully reset' 
        };
      } catch (error: any) {
        logger.error('Error resetting password:', error);
        set.status = error.message.includes('Invalid') ? 400 : 500;
        return { 
          success: false, 
          error: error.message || 'Failed to reset password' 
        };
      }
    },
    {
      body: resetPasswordSchema as any,
      detail: {
        tags: ['auth'],
        description: 'Reset password using a valid token',
        responses: {
          200: {
            description: 'Password successfully reset',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid or expired token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    error: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    }
  )
  
  // Validate reset token
  .get(
    '/validate-token/:token',
    async ({ params: { token }, set }) => {
      try {
        const isValid = await passwordService.validateResetToken(token);
        if (!isValid) {
          set.status = 400;
          return { 
            valid: false, 
            error: 'Invalid or expired password reset token' 
          };
        }
        
        return { valid: true };
      } catch (error) {
        logger.error('Error validating reset token:', error);
        set.status = 500;
        return { 
          valid: false, 
          error: 'Failed to validate token' 
        };
      }
    },
    {
      params: z.object({
        token: z.string(),
      }) as any,
      detail: {
        tags: ['auth'],
        description: 'Validate a password reset token',
        responses: {
          200: {
            description: 'Token validation result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    valid: { type: 'boolean' },
                    error: { type: 'string', nullable: true },
                  },
                },
              },
            },
          },
        },
      },
    }
  );
