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
      '@radix-ui/react-collapsible',
      '@radix-ui/react-slot',
    ],
    // 优化页面加载
    optimisticClientCache: true,
    // 启用 MDX 内容的静态生成
    mdxRs: true,
    // 启用 Webpack 5 的 Module Federation
    esmExternals: true,
  },

  // 启用压缩
  compress: true,

  // Turbopack 配置
  turbopack: {},

  // 模块化导入配置
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{kebabCase member}}',
    },
  },

  // 添加图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['img.dava.cc', 'www.google.com'],
    // 图片质量优化
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24, // 24 小时
    // 禁用静态图片导入
    disableStaticImages: false,
    // 启用远程图片优化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // 启用图片压缩
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
