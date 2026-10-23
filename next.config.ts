import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

// Media now lives in Cloudflare R2. The public base URL decides which host the
// optimizer is allowed to pull from, so it is read from the environment instead
// of being hardcoded — switching between the r2.dev subdomain and a custom
// domain is then an .env change (plus a rebuild, this file is read at build time).
const r2Host = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Still needed while media uploaded before the R2 switch lives in Supabase.
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      ...(r2Host
        ? [
            {
              protocol: "https" as const,
              hostname: r2Host,
            },
          ]
        : []),
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
