import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure transpilation for packages that might use modern ESM
  transpilePackages: ["leaflet", "react-leaflet"],
};

export default nextConfig;
