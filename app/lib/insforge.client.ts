import { createClient } from '@insforge/sdk';
import type { InsforgeConfig } from '~/config/env.client';

// Get InsForge configuration from environment variables
const getInsforgeConfig = (): InsforgeConfig => {
  if (typeof window === 'undefined') {
    return {
      baseUrl: '',
      apiKey: '',
    };
  }

  // These will be provided by the environment
  return {
    baseUrl: window.ENV?.INSFORGE_API_URL || '',
    apiKey: window.ENV?.INSFORGE_API_KEY || '',
  };
};

// Create InsForge client instance for client-side usage
export const insforgeClient = createClient({
  baseUrl: getInsforgeConfig().baseUrl,
  apiKey: getInsforgeConfig().apiKey,
});

// Helper function to check if InsForge is configured
export const isInsforgeConfigured = (): boolean => {
  const config = getInsforgeConfig();
  return !!(config.baseUrl && config.apiKey);
};

// Re-export client methods for convenience
export { insforgeClient as client };
