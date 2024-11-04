import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    reactCompiler: true,
    ppr: true,
    typedRoutes: true,
  },
};

export default nextConfig;
