import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./app/tests/setup.ts'],
    include: [
      'app/tests/unit/**/*.{test,spec}.{js,ts,tsx}',
      'app/tests/integration/**/*.{test,spec}.{js,ts,tsx}',
    ],
    exclude: [
      'node_modules',
      'app/tests/e2e',
      'build',
      'dist',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'app/tests/',
        'app/entry.client.tsx',
        'app/entry.server.tsx',
        'app/root.tsx',
        'vite.config.ts',
        'vitest.config.ts',
        'playwright.config.ts',
        'tailwind.config.ts',
        'postcss.config.js',
        'prisma/',
        'build/',
        'dist/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './app'),
      '~': resolve(__dirname, './'),
    },
  },
});
