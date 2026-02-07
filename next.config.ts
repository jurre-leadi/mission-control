import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloudflare Pages
  output: "standalone",
  
  // Disable image optimization (not supported on Cloudflare)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
