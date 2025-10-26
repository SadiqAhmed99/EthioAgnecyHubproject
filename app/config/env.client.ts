import { z } from 'zod';

// InsForge config type
export type InsforgeConfig = {
  baseUrl: string;
  apiKey: string;
};

// Client-safe environment variables schema
const clientEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Public API endpoints
  API_BASE_URL: z.string().url().optional(),
  
  // InsForge Configuration
  INSFORGE_API_URL: z.string().url().optional(),
  INSFORGE_API_KEY: z.string().optional(),
  
  // Feature flags
  ENABLE_ANALYTICS: z.string().default('false'),
  ENABLE_DEBUG: z.string().default('false'),
  
  // External services (public keys only)
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  RECAPTCHA_SITE_KEY: z.string().optional(),
  
  // App configuration
  APP_NAME: z.string().default('Ethio Agency Hub'),
  APP_VERSION: z.string().default('1.0.0'),
  APP_URL: z.string().url().optional(),
  
  // Upload configuration
  MAX_FILE_SIZE: z.string().default('10485760'), // 10MB
  ALLOWED_FILE_TYPES: z.string().default('pdf,jpg,jpeg,png'),
});

// Parse and validate client environment variables
export const clientEnv = clientEnvSchema.parse(process.env);

// Type for client environment variables
export type ClientEnv = z.infer<typeof clientEnvSchema>;

// Helper functions
export const isDevelopment = () => clientEnv.NODE_ENV === 'development';
export const isProduction = () => clientEnv.NODE_ENV === 'production';
export const isTest = () => clientEnv.NODE_ENV === 'test';

// App configuration
export const appConfig = {
  name: clientEnv.APP_NAME,
  version: clientEnv.APP_VERSION,
  url: clientEnv.APP_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
  environment: clientEnv.NODE_ENV,
};

// Feature flags
export const featureFlags = {
  analytics: clientEnv.ENABLE_ANALYTICS === 'true',
  debug: clientEnv.ENABLE_DEBUG === 'true' || isDevelopment(),
};

// API configuration
export const apiConfig = {
  baseUrl: clientEnv.API_BASE_URL || appConfig.url,
  timeout: 30000, // 30 seconds
  retries: 3,
};

// Upload configuration
export const uploadConfig = {
  maxFileSize: parseInt(clientEnv.MAX_FILE_SIZE),
  allowedTypes: clientEnv.ALLOWED_FILE_TYPES.split(','),
};

// External services configuration
export const externalServices = {
  googleMaps: {
    apiKey: clientEnv.GOOGLE_MAPS_API_KEY,
  },
  recaptcha: {
    siteKey: clientEnv.RECAPTCHA_SITE_KEY,
  },
};

// InsForge configuration
export const insforgeConfig = {
  baseUrl: clientEnv.INSFORGE_API_URL || '',
  apiKey: clientEnv.INSFORGE_API_KEY || '',
};

// Validation helper
export const validateClientEnv = () => {
  try {
    clientEnvSchema.parse(process.env);
    return true;
  } catch (error) {
    console.error('Client environment validation failed:', error);
    return false;
  }
};

// Get environment variable safely
export const getEnvVar = (key: string, defaultValue?: string): string => {
  if (typeof window === 'undefined') {
    return defaultValue || '';
  }
  
  return process.env[key] || defaultValue || '';
};
