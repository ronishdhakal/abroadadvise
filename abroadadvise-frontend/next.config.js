/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1'],  // Add localhost to the list of allowed domains for images
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',  // Allow fetching from localhost:8000
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',  // Allow fetching from localhost:8000
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

module.exports = nextConfig;
