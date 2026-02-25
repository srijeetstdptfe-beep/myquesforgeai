import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['mammoth', 'pdf-parse', 'pdf2json'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
} as NextConfig;

// Only apply Turbopack loader in development to avoid absolute path leaks in production builds
if (process.env.NODE_ENV === 'development') {
  try {
    const loaderPath = require.resolve('orchids-visual-edits/loader.js');
    (nextConfig as any).turbopack = {
      rules: {
        "*.{jsx,tsx}": {
          loaders: [loaderPath]
        }
      }
    };
  } catch (e) {
    // Ignore if package not found in build environment
  }
}

export default nextConfig;
