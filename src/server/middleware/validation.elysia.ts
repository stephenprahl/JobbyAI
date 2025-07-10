const { Elysia } = require('elysia');
import { AnyZodObject } from 'zod';
import { logger } from '../utils/logger';
import { ValidationError } from './error';

/**
 * Creates Elysia middleware for request validation
 * @param schema Zod schema to validate against
 * @param target The request property to validate ('body', 'query', or 'params')
 * @returns Elysia plugin with validation
 */
export const validateRequest = <T extends AnyZodObject>(
  schema: T,
  target: 'body' | 'query' | 'params' = 'body'
) => {
  return new Elysia().onParse(async (context: any, _contentType) => {
    try {
      // Get the data based on the target
      let data: any;
      switch (target) {
        case 'body':
          data = 'body' in context ? context.body : undefined;
          break;
        case 'query':
          data = 'query' in context ? context.query : undefined;
          break;
        case 'params':
          data = 'params' in context ? context.params : undefined;
          break;
        default:
          data = undefined;
      }

      const result = await schema.safeParseAsync(data);

      if (!result.success) {
        throw new ValidationError('Validation failed', result.error.issues);
      }

      // Update the context with validated data
      if (target === 'body' && 'body' in context) {
        context.body = result.data;
      } else if (target === 'query' && 'query' in context) {
        context.query = result.data;
      } else if (target === 'params' && 'params' in context) {
        context.params = result.data;
      }

      return true;
    } catch (error) {
      logger.error('Validation error:', error);
      throw error;
    }
  });
};

/**
 * Validates request body against a Zod schema
 */
export const validateBody = <T extends AnyZodObject>(schema: T) =>
  validateRequest(schema, 'body');

/**
 * Validates query parameters against a Zod schema
 */
export const validateQuery = <T extends AnyZodObject>(schema: T) =>
  validateRequest(schema, 'query');

/**
 * Validates route parameters against a Zod schema
 */
export const validateParams = <T extends AnyZodObject>(schema: T) =>
  validateRequest(schema, 'params');

/**
 * Validates headers against a Zod schema
 */
export const validateHeaders = <T extends AnyZodObject>(schema: T) => {
  return new Elysia().onParse(async ({ request }, _contentType) => {
    try {
      const headers = Object.fromEntries(request.headers.entries());
      const result = await schema.safeParseAsync(headers);

      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        logger.warn('Header validation failed', {
          headers: Object.keys(headers),
          errors,
          url: request.url,
          method: request.method,
        });

        throw new ValidationError('Invalid headers', { errors });
      }

      return result.data;
    } catch (error) {
      logger.error('Error during header validation:', error);
      throw error;
    }
  });
};

/**
 * Validates the response against a Zod schema
 */
export const validateResponse = <T extends AnyZodObject>(schema: T) => {
  return new Elysia().onAfterHandle(({ response }) => {
    try {
      const result = schema.safeParse(response);

      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        logger.error('Response validation failed', {
          errors,
          response: JSON.stringify(response).substring(0, 500),
        });

        throw new ValidationError('Response validation failed', { errors });
      }

      // Replace the response with the validated data
      return result.data;
    } catch (error) {
      logger.error('Error during response validation:', error);
      throw error;
    }
  });
};
