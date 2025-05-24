/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // ✅ Allow external image optimization for both local dev and production
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
      {
        protocol: 'https',
        hostname: 'abroadadvise.onrender.com',
        pathname: '/media/**',
      },
    ],

    // ✅ Domain whitelist for older next/image support
    domains: ['127.0.0.1', 'localhost', 'abroadadvise.onrender.com'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
