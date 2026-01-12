import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.nickopusan.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
