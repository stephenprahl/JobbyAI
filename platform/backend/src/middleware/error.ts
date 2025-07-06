import { Elysia } from 'elysia';
import { logger } from '../utils/logger';

/**
 * Custom error handler middleware for Elysia.js
 * This middleware handles errors consistently across the application
 */
export const errorHandler = new Elysia()
  .onError(({ code, error, set }) => {
    // Log the error with additional context
    logger.error(`[${code}] ${error.message}`, {
      stack: error.stack,
      code,
      timestamp: new Date().toISOString()
    });

    // Format the error response
    const status = 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const isProduction = process.env.NODE_ENV === 'production';
    
    set.status = status;
    return {
      success: false,
      error: isProduction && status >= 500 ? 'Internal Server Error' : error.message,
      ...(!isProduction && {
        stack: 'stack' in error ? error.stack : undefined,
        details: 'details' in error ? error.details : undefined,
      })
    };
  });

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
    
    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request Error
 */
export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request', details?: any) {
    super(message, 400, details);
    this.name = 'BadRequestError';
  }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', details?: any) {
    super(message, 401, details);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden', details?: any) {
    super(message, 403, details);
    this.name = 'ForbiddenError';
  }
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Not Found', details?: any) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
}

/**
 * 409 Conflict Error
 */
export class ConflictError extends ApiError {
  constructor(message: string = 'Conflict', details?: any) {
    super(message, 409, details);
    this.name = 'ConflictError';
  }
}

/**
 * 422 Unprocessable Entity Error
 */
export class ValidationError extends ApiError {
  constructor(message: string = 'Validation Error', details?: any) {
    super(message, 422, details);
    this.name = 'ValidationError';
  }
}

/**
 * 429 Too Many Requests Error
 */
export class RateLimitError extends ApiError {
  constructor(message: string = 'Too Many Requests', details?: any) {
    super(message, 429, details);
    this.name = 'RateLimitError';
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal Server Error', details?: any) {
    super(message, 500, details);
    this.name = 'InternalServerError';
  }
}

/**
 * 503 Service Unavailable Error
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message: string = 'Service Unavailable', details?: any) {
    super(message, 503, details);
  }
}

// Export all error types for convenience
export const errors = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError
};
