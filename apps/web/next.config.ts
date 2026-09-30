import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@frameitup/ui', '@frameitup/types', '@frameitup/convex'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.convex.cloud' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
