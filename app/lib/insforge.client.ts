import { createClient } from '@insforge/sdk';
import { insforgeConfig } from '~/config/env.client';

// Create InsForge client instance for client-side usage
export const insforgeClient = createClient({
  baseUrl: insforgeConfig.baseUrl,
  apiKey: insforgeConfig.apiKey,
});

// Helper function to check if InsForge is configured
export const isInsforgeConfigured = (): boolean => {
  return !!(insforgeConfig.baseUrl && insforgeConfig.apiKey);
};

// Re-export client methods for convenience
export { insforgeClient as client };
