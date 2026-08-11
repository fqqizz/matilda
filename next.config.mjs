/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from any hostname (for external product images)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Required for Vercel deployment — ensures proper page routing
  trailingSlash: false,

  // Suppress the "x-powered-by" header
  poweredByHeader: false,
};

export default nextConfig;
