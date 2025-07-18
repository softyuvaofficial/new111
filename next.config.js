/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  // You can add runtime caching options here if needed
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true, // Use new app directory
  },
  images: {
    domains: ["your-image-host.com", "supabase.co"], // Add your image domains here
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});

module.exports = nextConfig;
