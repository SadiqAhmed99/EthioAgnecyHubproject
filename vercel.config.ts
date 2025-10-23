export default {
  // Optimize for Vercel's edge runtime
  runtime: 'edge',
  
  // Build configuration
  buildCommand: 'npm run build',
  
  // Environment variables
  env: {
    NODE_ENV: 'production',
  },
  
  // Function configuration
  functions: {
    'app/entry.server.tsx': {
      maxDuration: 30,
    },
  },
  
  // Headers for security and performance
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
    {
      source: '/build/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
  
  // Redirects
  redirects: [
    {
      source: '/dashboard',
      destination: '/dashboard/',
      permanent: true,
    },
  ],
  
  // Rewrites for SPA behavior
  rewrites: [
    {
      source: '/api/:path*',
      destination: '/api/:path*',
    },
  ],
};
