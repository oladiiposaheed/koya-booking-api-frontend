import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: 'https://koya-booking-backend.de2.netrun.io/api/:path*',
      },
    ];
  },
};

export default nextConfig;