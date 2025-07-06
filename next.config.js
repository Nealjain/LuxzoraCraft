/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'your-supabase-storage-url.supabase.co',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    serverActions: {},
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true, layers: true };
    config.externals = [...config.externals, 'bufferutil', 'utf-8-validate'];
    config.resolve.alias['@splinetool/react-spline'] = require('path').join(__dirname, 'node_modules/@splinetool/react-spline/dist/react-spline.js');
    return config;
  },
}

module.exports = nextConfig