import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile higher up the tree otherwise becomes the inferred root, and
  // `@import "tailwindcss"` then resolves from outside this project.
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // 90 is used for full-bleed press imagery, where 75 shows visible softness.
    qualities: [75, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ddnckiuudgmvtyzmjmvn.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Long-cache videos: filenames are content-stable, so we can give
        // them an aggressive immutable cache and let CDN/browser keep them.
        source: '/:path*\\.(mp4|m4s|webm|mov)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Accept-Ranges', value: 'bytes' },
        ],
      },
      {
        // Stream playlists are as content-stable as the videos they point at.
        source: '/:path*\\.m3u8',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Content-Type', value: 'application/vnd.apple.mpegurl' },
        ],
      },
      {
        // Same for posters and content images shipped from /public.
        source: '/:path*\\.(webp|jpg|jpeg|png|svg|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
