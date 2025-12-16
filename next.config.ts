import type { NextConfig } from "next";
import nextMDX from "@next/mdx";

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
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

export default withMDX(nextConfig);
