import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  HOST: z.string().default('0.0.0.0'),
  
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_HOST: z.string().default('postgres'),
  DATABASE_PORT: z.string().default('5432'),
  DATABASE_NAME: z.string().default('resume_plan_ai'),
  DATABASE_USER: z.string().default('postgres'),
  DATABASE_PASSWORD: z.string().default('postgres'),
  
  // Ollama
  OLLAMA_API_URL: z.string().url().default('http://localhost:11434/api/generate'),
  OLLAMA_MODEL: z.string().default('llama3'),
  OLLAMA_TEMPERATURE: z.string().default('0.3'),
  
  // JWT (for future use)
  JWT_SECRET: z.string().default('your_jwt_secret_here'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // CORS
  CORS_ORIGIN: z.string().default('*'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX: z.string().default('100'),
});

// Parse environment variables
const envVars = envSchema.parse(process.env);

// Export the validated environment variables
export const env = {
  ...envVars,
  PORT: parseInt(envVars.PORT, 10),
  DATABASE_PORT: parseInt(envVars.DATABASE_PORT, 10),
  RATE_LIMIT_WINDOW_MS: parseInt(envVars.RATE_LIMIT_WINDOW_MS, 10),
  RATE_LIMIT_MAX: parseInt(envVars.RATE_LIMIT_MAX, 10),
  isProduction: envVars.NODE_ENV === 'production',
  isDevelopment: envVars.NODE_ENV === 'development',
  isTest: envVars.NODE_ENV === 'test',
} as const;

// Export the type for use in the application
export type Env = typeof env;
