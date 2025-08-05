import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'https://chatbotai-fkbtcmapa2agh3cc.westus-01.azurewebsites.net', // Ganti dengan URL backend API Anda
  },
};


export default nextConfig;