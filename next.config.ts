import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow the dev server to serve HMR/dev resources through an ngrok tunnel
  // (needed for SePay sandbox IPN testing). Dev-only; ignored in production.
  allowedDevOrigins: ["*.ngrok-free.app"],
  // The /api/og/* routes fs-read fonts and PNGs at render time; public/ and
  // assets/ are not traced into serverless bundles automatically.
  outputFileTracingIncludes: {
    "/api/og/badge": ["./assets/fonts/*", "./public/badges/*", "./public/logo-bird.png"],
    "/api/og/stats": ["./assets/fonts/*", "./public/logo-bird.png", "./public/icons/*"],
  },
};

export default nextConfig;
