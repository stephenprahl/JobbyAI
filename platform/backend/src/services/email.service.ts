import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private from: string;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.EMAIL_ENABLED === 'true';
    this.from = process.env.EMAIL_FROM || 'noreply@resumeplan.ai';
    
    if (this.isEnabled) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // Verify connection configuration
      this.transporter.verify()
        .then(() => logger.info('Email server is ready to take our messages'))
        .catch(error => logger.error('Email server connection error:', error));
    }
  }

  public async sendVerificationEmail(to: string, token: string, name?: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const subject = 'Verify your email address';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Resume Plan AI!</h2>
        <p>Hello ${name || 'there'},</p>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This email was sent to ${to}. If you didn't request this, please ignore this email.
        </p>
      </div>
    `;

    const text = `Welcome to Resume Plan AI!\n\n` +
      `Hello ${name || 'there'},\n\n` +
      `Thank you for signing up. Please verify your email address by visiting this link:\n` +
      `${verificationUrl}\n\n` +
      `This link will expire in 24 hours.\n\n` +
      `If you didn't create an account, you can safely ignore this email.`;

    return this.sendEmail({
      to,
      subject,
      html,
      text
    });
  }

  public async sendPasswordResetEmail(to: string, token: string, name?: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const subject = 'Reset your password';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>Hello ${name || 'there'},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p><code>${resetUrl}</code></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The Resume Plan AI Team</p>
      </div>
    `;

    const text = `Reset Your Password\n\n` +
      `Hello ${name || 'there'},\n\n` +
      `We received a request to reset your password. Please visit this URL to set a new password:\n\n` +
      `${resetUrl}\n\n` +
      `This link will expire in 1 hour.\n\n` +
      `If you didn't request a password reset, you can safely ignore this email.\n\n` +
      `Best regards,\nThe Resume Plan AI Team`;

    return this.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  private async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isEnabled || !this.transporter) {
      logger.warn('Email sending is disabled. Email details:', {
        to: options.to,
        subject: options.subject,
      });
      return true;
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      logger.info('Email sent:', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });

      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
