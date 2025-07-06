import { Elysia } from 'elysia';
import type { Context } from 'elysia';

interface RateLimitOptions {
  windowMs?: number;
  max?: number;
  message?: string;
  statusCode?: number;
  skip?: (request: Request) => boolean;
  keyGenerator?: (context: Context) => string;
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const defaultOptions: Required<RateLimitOptions> = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  statusCode: 429,
  skip: () => false,
  keyGenerator: (context: Context) => {
    // Use the IP address as the key
    return context.request.headers.get('cf-connecting-ip') || 
           context.request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
           context.request.headers.get('x-real-ip') ||
           'unknown';
  }
};

export const rateLimit = (options: RateLimitOptions = {}) => {
  const { 
    windowMs, 
    max, 
    message, 
    skip, 
    keyGenerator 
  } = { ...defaultOptions, ...options };

  const store = new Map<string, RateLimitStore>();

  // Clean up old entries
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
      if (value.resetTime <= now) {
        store.delete(key);
      }
    }
  }, windowMs).unref();

  return (app: Elysia) => {
    // Add rate limit headers to all responses
    app.onResponse(({ set, request }) => {
      // Don't add headers for OPTIONS requests
      if (request.method === 'OPTIONS') return;
      
      // Get the client's IP address for the rate limit key
      const ip = request.headers.get('cf-connecting-ip') || 
                request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                request.headers.get('x-real-ip') ||
                'unknown';
      
      const entry = store.get(ip);
      if (!entry) return;
      
      // Add rate limit headers to the response
      const remaining = Math.max(0, max - entry.count);
      const resetTime = Math.ceil(entry.resetTime / 1000);
      const headers: Record<string, string> = {
        'X-RateLimit-Limit': max.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
      };
      
      // Type assertion to handle the Set-Cookie header
      set.headers = headers as any;
    });

    // Apply rate limiting to all requests
    return app.onRequest(async (context) => {
      // Skip rate limiting for certain requests if needed
      if (skip(context.request)) {
        return;
      }

      const key = keyGenerator(context as unknown as Context);
      const now = Date.now();
      
      let entry = store.get(key);
      
      if (!entry || entry.resetTime <= now) {
        // Create new entry
        entry = {
          count: 0,
          resetTime: now + windowMs
        };
        store.set(key, entry);
      }

      // Increment the counter
      entry.count += 1;

      // Check if rate limit is exceeded
      if (entry.count > max) {
        context.set.status = 429;
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        // Create a new headers object with the retry-after header
        const headers: Record<string, string> = {
          'Retry-After': retryAfter.toString(),
        };
        // Type assertion to handle the Set-Cookie header
        context.set.headers = headers as any;
        
        throw new Error(message);
      }
    });
  };
};
