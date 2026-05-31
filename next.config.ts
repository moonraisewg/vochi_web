import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow the dev server to serve HMR/dev resources through an ngrok tunnel
  // (needed for SePay sandbox IPN testing). Dev-only; ignored in production.
  allowedDevOrigins: ["*.ngrok-free.app"],
};

export default nextConfig;
