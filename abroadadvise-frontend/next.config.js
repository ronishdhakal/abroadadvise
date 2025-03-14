/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  // Enforce strict mode for better debugging
  swcMinify: true,  // Optimize with SWC minifier

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',  // Allow fetching images from localhost:8000
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',  // Allow fetching images from localhost:8000
        port: '8000',
        pathname: '/media/**',
      },
    ],
    domains: ['localhost', '127.0.0.1'],  // Allow localhost images
  },

  experimental: {
    appDir: true,  // Enable Next.js App Router if needed
  },
};

module.exports = nextConfig;
