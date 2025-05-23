/**
 * Next.js 配置文件
 */

import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 基本配置
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // 忽略构建错误
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 实验性功能
  experimental: {
    // 优化构建输出 - 添加所有可能影响性能的包
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toggle',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      '@radix-ui/react-visually-hidden',
      'react-intersection-observer'
    ],
    // 优化页面加载
    optimisticClientCache: true,
  },

  // 添加图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['img.dava.cc', 'www.google.com'],
    // 图片质量优化
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // 优化服务器组件
  serverExternalPackages: ['@mdx-js/react'],
};

// MDX 配置
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

// 导出配置
export default withMDX(nextConfig);
