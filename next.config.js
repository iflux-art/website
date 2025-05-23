/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 配置输出选项，优化 Cloudflare Pages 部署
  output: 'standalone',
  
  // 配置图像优化
  images: {
    unoptimized: true, // Cloudflare Pages 不支持 Next.js 的图像优化
    domains: ['img.dava.cc'], // 允许的外部图像域名
  },
  
  // 配置 webpack 以减小构建大小
  webpack: (config, { isServer }) => {
    // 只在客户端构建中应用这些优化
    if (!isServer) {
      // 分割大型依赖包
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 1000000, // 1MB，避免生成超大文件
      };
    }
    
    return config;
  },
  
  // 配置环境变量
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://ifluxart.com',
  },
  
  // 配置 Cloudflare 兼容性
  experimental: {
    // 禁用一些可能在 Cloudflare 上不兼容的功能
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig;
