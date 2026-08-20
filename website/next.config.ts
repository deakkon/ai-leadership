import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/ai-leadership",
  assetPrefix: "/ai-leadership/",
  trailingSlash: true,
};

export default nextConfig;
