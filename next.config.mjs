/**
 * Next.js 配置文件
 */

import createMDX from '@next/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

// MDX 配置
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug, 
      rehypeAutolinkHeadings,
      // 添加基础代码块处理
      () => (tree) => {
        // 遍历 AST，确保代码块使用标准标签
        const visit = (node) => {
          if (node.tagName === 'pre') {
            const code = node.children.find(child => child.tagName === 'code');
            if (code) {
              code.tagName = 'code';
              code.properties = code.properties || {};
              code.properties.className = code.properties.className || ['language-text'];
            }
          }
          if (node.children) {
            node.children.forEach(visit);
          }
        };
        visit(tree);
      }
    ],
    jsx: true,
    format: 'mdx'
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 基本配置
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // 配置外部包
  serverExternalPackages: ['@mdx-js/react'],

  // ESLint 和 TypeScript 错误检查配置
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
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
  },

  // 图片优化配置
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24, // 24 小时
    disableStaticImages: false,
    domains: ['img.dava.cc'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.dava.cc',
        pathname: '/img/**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
};

// 导出配置
export default withMDX(nextConfig);