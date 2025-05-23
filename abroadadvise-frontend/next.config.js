/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Allow external image optimization from local backend during development
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],

    // For basic domain whitelisting (older Next.js versions or fallback)
    domains: ['127.0.0.1', 'localhost'],
  },

  eslint: {
    // Skip ESLint checks during production build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
