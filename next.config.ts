import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  transpilePackages: ["lucide-react"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/**" },
      { protocol: "https", hostname: "api.dentalmarechal.com.br", pathname: "/storage/v1/**" }, // Supabase novo (self-hosted)
    ],
  },
};

export default nextConfig;
