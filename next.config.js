/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'localhost',
      'your-supabase-storage-url.supabase.co'
    ],
  },
  experimental: {
    serverActions: {},
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true, layers: true };
    config.externals = [...config.externals, 'bufferutil', 'utf-8-validate'];
    return config;
  },
}

module.exports = nextConfig