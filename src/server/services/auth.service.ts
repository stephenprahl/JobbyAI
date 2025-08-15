import { compare, hash } from 'bcryptjs';
import { addHours } from 'date-fns';
import { sign, verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { emailService } from './email.service';
import prisma from './prisma.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() { }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async register(email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'USER',
        isActive: true,
        emailVerified: false,
      },
    });

    // Generate verification token
    const verificationToken = await this.createVerificationToken(user.id);

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        user.email,
        verificationToken.token
      );
    } catch (error) {
      logger.error('Failed to send verification email:', error);
      // Don't fail registration if email sending fails
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    });

    return {
      success: true,
      data: {
        accessToken: token,
        refreshToken: token // For now, using same token for both
      },
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    };
  }

  public async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    });

    return {
      success: true,
      data: {
        accessToken: token,
        refreshToken: token // For now, using same token for both
      },
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
      }
    };
  }

  public verifyToken(token: string): AuthPayload {
    try {
      return verify(token, JWT_SECRET) as AuthPayload;
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw new Error('Invalid or expired token');
    }
  }

  private generateToken(payload: AuthPayload): string {
    // Use type assertion to handle the JWT sign options
    return sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as string | number
    } as any);
  }

  private async createVerificationToken(userId: string): Promise<{ token: string }> {
    const token = uuidv4();
    const expires = addHours(new Date(), 24); // Token expires in 24 hours

    await prisma.verificationToken.create({
      data: {
        token,
        userId,
        expires,
      },
    });

    return { token };
  }

  public async verifyEmail(token: string): Promise<boolean> {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      throw new Error('Invalid or expired verification token');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true },
      }),
      prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      }),
    ]);

    return true;
  }

  public async resendVerificationEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if user exists or not
      return true;
    }

    if (user.emailVerified) {
      throw new Error('Email already verified');
    }

    // Delete any existing verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Create and send new verification token
    const verificationToken = await this.createVerificationToken(user.id);

    try {
      await emailService.sendVerificationEmail(
        user.email,
        verificationToken.token,
        user.firstName || undefined
      );
      return true;
    } catch (error) {
      logger.error('Failed to resend verification email:', error);
      throw new Error('Failed to resend verification email');
    }
  }

  public async getCurrentUser(token: string) {
    const payload = this.verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    return user;
  }
}

export const authService = AuthService.getInstance();
