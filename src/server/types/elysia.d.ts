import { AuthPayload } from '../services/auth.service';

declare module 'elysia' {
  interface Context {
    user?: {
      userId: string;
      email: string;
      role: string;
      emailVerified: boolean;
    };
    isAdmin: boolean;
    isVerified: boolean;
  }
}
