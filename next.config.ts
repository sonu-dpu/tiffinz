import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://ik.imagekit.io/**"), new URL("https://example.com/**")],
  },
};

export default nextConfig;
