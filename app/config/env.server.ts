import { z } from 'zod';

// Server-only environment variables schema
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url('Invalid database URL'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  SESSION_SECRET: z.string().min(32, 'Session secret must be at least 32 characters'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Email configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // SMS configuration
  SMS_API_KEY: z.string().optional(),
  SMS_API_URL: z.string().url().optional(),
  
  // External services
  MOLS_API_URL: z.string().url().optional(),
  MOLS_API_KEY: z.string().optional(),

  // InsForge backend service
  INSFORGE_API_URL: z.string().url().optional(),
  INSFORGE_API_KEY: z.string().optional(),
  
  // File upload
  MAX_FILE_SIZE: z.string().default('10485760'), // 10MB
  ALLOWED_FILE_TYPES: z.string().default('pdf,jpg,jpeg,png'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX: z.string().default('100'),
});

// Parse and validate server environment variables
export const serverEnv = serverEnvSchema.parse(process.env);

// Type for server environment variables
export type ServerEnv = z.infer<typeof serverEnvSchema>;

// Helper functions
export const isDevelopment = () => serverEnv.NODE_ENV === 'development';
export const isProduction = () => serverEnv.NODE_ENV === 'production';
export const isTest = () => serverEnv.NODE_ENV === 'test';

// Database configuration
export const dbConfig = {
  url: serverEnv.DATABASE_URL,
  ssl: isProduction() ? { rejectUnauthorized: false } : false,
  connectionLimit: isProduction() ? 20 : 5,
};

// JWT configuration
export const jwtConfig = {
  secret: serverEnv.JWT_SECRET,
  expiresIn: '24h',
  issuer: 'ethio-agency-hub',
  audience: 'ethio-agency-hub-users',
};

// Session configuration
export const sessionConfig = {
  secret: serverEnv.SESSION_SECRET,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: isProduction(),
  httpOnly: true,
  sameSite: 'strict' as const,
};

// File upload configuration
export const uploadConfig = {
  maxFileSize: parseInt(serverEnv.MAX_FILE_SIZE),
  allowedTypes: serverEnv.ALLOWED_FILE_TYPES.split(','),
  uploadPath: isProduction() ? '/tmp/uploads' : './uploads',
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: parseInt(serverEnv.RATE_LIMIT_WINDOW),
  max: parseInt(serverEnv.RATE_LIMIT_MAX),
};

// Email configuration
export const emailConfig = {
  host: serverEnv.SMTP_HOST,
  port: serverEnv.SMTP_PORT ? parseInt(serverEnv.SMTP_PORT) : 587,
  user: serverEnv.SMTP_USER,
  pass: serverEnv.SMTP_PASS,
  secure: isProduction(),
};

// SMS configuration
export const smsConfig = {
  apiKey: serverEnv.SMS_API_KEY,
  apiUrl: serverEnv.SMS_API_URL,
};

// MOLS configuration
export const molsConfig = {
  apiUrl: serverEnv.MOLS_API_URL,
  apiKey: serverEnv.MOLS_API_KEY,
};

// InsForge configuration
export const insforgeConfig = {
  baseUrl: serverEnv.INSFORGE_API_URL,
  apiKey: serverEnv.INSFORGE_API_KEY,
};
