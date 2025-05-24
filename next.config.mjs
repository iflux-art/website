/**
 * Next.js 配置文件
 */

import createMDX from '@next/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 基本配置
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // 基础配置
  reactStrictMode: true,

  // 忽略构建错误
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 实验性功能
  experimental: {
    // 优化构建输出
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toggle',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
    ],
  },

  // 启用压缩
  compress: true,

  // 模块化导入配置
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{kebabCase member}}',
    },
  },

  // 图片优化配置
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['img.dava.cc', 'www.google.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
  },

  // 优化服务器组件
  serverExternalPackages: ['@mdx-js/react'],
};

// MDX 配置
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    providerImportSource: '@mdx-js/react',
  },
});

// 导出配置
export default withMDX(nextConfig);
