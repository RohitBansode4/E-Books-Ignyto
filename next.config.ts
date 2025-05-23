import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'my-pdf-books-bucket-01.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],    
  },
  env: {
    API_BASE_URL: 'https://worksheets.asvabwarriors.org',
  },
};

export default nextConfig;
