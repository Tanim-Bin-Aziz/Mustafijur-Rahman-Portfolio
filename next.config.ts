import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    qualities: [75, 95],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  reactStrictMode: true,
  compress: true,
  experimental: {
    // Middleware/Proxy clones the incoming request body before forwarding it
    // to the app. It defaults to 10MB and silently ENDS the stream early when
    // exceeded, which truncates a multipart upload and surfaces as the cryptic
    // busboy error "Unexpected end of form". Keep it aligned with the Server
    // Actions body limit below so large video uploads survive the hop.
    proxyClientMaxBodySize: "1gb",
    serverActions: {
      // Video uploads (CLO 3D renders, showcase, additional work) go through
      // Server Actions. Next aborts the request body mid-stream once this limit
      // is hit, which surfaces as a cryptic "Unexpected end of form" busboy
      // error instead of a real message — keep it well above the file sizes we
      // actually accept.
      bodySizeLimit: "1gb",
    },
  },
};

export default nextConfig;
