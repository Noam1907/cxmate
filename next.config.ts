import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    CX_MATE_ANTHROPIC_API_KEY: process.env.CX_MATE_ANTHROPIC_API_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
};

export default nextConfig;
