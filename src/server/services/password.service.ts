import { randomUUID } from 'crypto';
import { addHours } from 'date-fns';
import prisma from './prisma.service';
import { emailService } from './email.service';
import { logger } from '../utils/logger';

class PasswordService {
  private readonly RESET_TOKEN_EXPIRY_HOURS = 1;

  /**
   * Request a password reset for a user by email
   */
  public async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, firstName: true, lastName: true },
      });

      // Don't reveal if the email exists or not
      if (!user) {
        logger.info(`Password reset requested for non-existent email: ${email}`);
        return true;
      }

      // Create a reset token
      const token = randomUUID();
      const expiresAt = addHours(new Date(), this.RESET_TOKEN_EXPIRY_HOURS);

      // Store the token in the database
      await prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expires: expiresAt,
        },
      });

      // Send the reset email
      await emailService.sendPasswordResetEmail(
        user.email,
        token,
        user.firstName || undefined
      );

      return true;
    } catch (error) {
      logger.error('Error requesting password reset:', error);
      throw new Error('Failed to process password reset request');
    }
  }

  /**
   * Reset a user's password using a valid token
   */
  public async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      // Find the token and check if it's valid
      const tokenRecord = await prisma.passwordResetToken.findUnique({
        where: {
          token,
          used: false,
          expires: {
            gte: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!tokenRecord) {
        throw new Error('Invalid or expired password reset token');
      }

      // Update the user's password
      await prisma.$transaction([
        prisma.user.update({
          where: { id: tokenRecord.userId },
          data: { passwordHash: newPassword },
        }),
        prisma.passwordResetToken.update({
          where: { id: tokenRecord.id },
          data: { used: true },
        }),
      ]);

      return true;
    } catch (error) {
      logger.error('Error resetting password:', error);
      throw new Error('Failed to reset password');
    }
  }

  /**
   * Validate a password reset token
   */
  public async validateResetToken(token: string): Promise<boolean> {
    try {
      const tokenRecord = await prisma.passwordResetToken.findUnique({
        where: {
          token,
          used: false,
          expires: {
            gte: new Date(),
          },
        },
      });

      return !!tokenRecord;
    } catch (error) {
      logger.error('Error validating reset token:', error);
      return false;
    }
  }
}

export const passwordService = new PasswordService();
