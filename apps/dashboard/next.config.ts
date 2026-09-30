import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@frameitup/ui", "@frameitup/types", "@frameitup/convex"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.convex.cloud" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
