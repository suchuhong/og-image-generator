/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 允许从任何域名加载图片
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // 允许从同域名加载图片
  experimental: {},
  // 确保sharp包在服务端可用
  serverExternalPackages: ['sharp'],
  // 确保在开发环境和生产环境中都能正确获取站点URL
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000',
  },
};

module.exports = nextConfig; 