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

  // 图片域名
  images: {
    domains: ['img.dava.cc'],
  },

  // 优化输出大小 - 生成独立部署包
  output: 'standalone',

  // 实验性功能
  experimental: {
    // 优化构建输出
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // 减少 serverless 函数大小
    serverMinification: true,
    // 优化服务器组件
    serverComponentsExternalPackages: ['@mdx-js/react'],
  },

  // 优化 webpack 配置
  webpack: (config, { isServer }) => {
    // 只保留必要的语言环境
    if (config.optimization && config.optimization.minimizer) {
      config.optimization.minimizer.forEach((plugin) => {
        if (plugin.constructor.name === 'TerserPlugin') {
          if (plugin.options && plugin.options.terserOptions) {
            plugin.options.terserOptions.compress = {
              ...plugin.options.terserOptions.compress,
              drop_console: true,
            };
          }
        }
      });
    }

    // 减少 serverless 函数大小
    if (isServer) {
      // 排除不必要的依赖
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    }

    return config;
  },
};

// MDX 配置
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

// 导出配置
export default withMDX(nextConfig);
