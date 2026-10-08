import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@frameitup/ui', '@frameitup/types', '@frameitup/convex'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudflare.com' },
      { protocol: 'https', hostname: '**.r2.dev' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.convex.cloud' },
      { protocol: 'https', hostname: '**.convex.site' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
