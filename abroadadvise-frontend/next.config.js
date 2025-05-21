/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ Static export enabled
  reactStrictMode: true,

  images: {
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
    domains: ['localhost', '127.0.0.1'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
