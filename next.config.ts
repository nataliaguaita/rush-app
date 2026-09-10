import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  transpilePackages: ["lucide-react"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/**" }],
  },
};

export default nextConfig;
