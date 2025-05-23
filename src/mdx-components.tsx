'use client';

import React from 'react';
import { ImageProps } from 'next/image';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { LazyCodeBlock } from '@/components/lazy-components';
import { InlineCode } from '@/components/ui/inline-code';
import { H1, H2, H3, H4 } from '@/components/ui/heading-with-anchor';
import { MarkdownLink } from '@/components/ui/markdown-link';
import { UnifiedCard } from '@/components/ui/unified-card';
import { UnifiedGrid } from '@/components/ui/unified-grid';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: Record<string, React.ComponentType<any>>) {
  return {
    // 基础包装器，使用 Typography 插件样式，符合 New York 风格
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <article className="prose dark:prose-invert prose-neutral max-w-none pl-8 relative">
        {children}
      </article>
    ),

    // 标题组件
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,

    // 图片组件 - 使用响应式图片组件
    img: (props: ImageProps) => {
      return (
        <ResponsiveImage
          {...(props as ImageProps)}
          width={props.width || 1080}
          height={props.height || 500}
          imageSizes={{
            mobile: 640,
            tablet: 1024,
            desktop: 1920,
          }}
          formats={{
            webp: true,
            avif: true,
            original: true,
          }}
          style={{ width: '100%', height: 'auto' }}
          className="rounded-lg border border-border my-8 shadow-sm"
          alt={props.alt || ''}
          lazy={true}
          containerClassName="my-8"
          quality={85}
          placeholder={
            <div className="w-full h-full bg-muted/30 rounded-lg border border-border animate-pulse" />
          }
        />
      );
    },

    // 自定义链接组件
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      if (!href) return <span {...props}>{children}</span>;

      return (
        <MarkdownLink
          href={href}
          isExternal={
            href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
          }
          {...props}
        >
          {children}
        </MarkdownLink>
      );
    },

    // 使用自定义代码块组件 - 懒加载
    pre: ({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
      return (
        <LazyCodeBlock className={className} {...props}>
          {children}
        </LazyCodeBlock>
      );
    },

    // 使用自定义行内代码组件
    code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
      // 如果是代码块的一部分，不使用行内代码样式
      if (className?.includes('language-')) {
        return <code className={className}>{children}</code>;
      }

      // 使用行内代码组件
      return <InlineCode className={className}>{children}</InlineCode>;
    },

    // 统一卡片组件
    ResourceCard: (props: any) => <UnifiedCard type="resource" {...props} />,
    ResourceGrid: (props: any) => <UnifiedGrid {...props} type="resource" />,

    // 友情链接组件
    FriendLinkCard: (props: any) => <UnifiedCard type="friend" {...props} />,
    FriendLinkGrid: (props: any) => <UnifiedGrid {...props} type="friend" />,

    // 直接使用统一组件
    UnifiedCard,
    UnifiedGrid,

    // 使用传入的组件
    ...components,
  };
}
