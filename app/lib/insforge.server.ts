import { createClient } from '@insforge/sdk';
import { insforgeConfig } from '~/config/env.server';

// Create InsForge client instance
export const insforgeClient = createClient({
  baseUrl: insforgeConfig.baseUrl || '',
  apiKey: insforgeConfig.apiKey || '',
});

// Helper function to get authenticated client (for server-side operations)
export function getAuthenticatedClient(userToken: string) {
  return createClient({
    baseUrl: insforgeConfig.baseUrl || '',
    edgeFunctionToken: userToken,
  });
}