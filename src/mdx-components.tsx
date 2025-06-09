'use client';

import React from 'react';
import { ImageProps } from 'next/image';
import type { StaticImageData } from 'next/image';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import type { ResponsiveImageSizes, ResponsiveImageFormats } from '@/components/ui/responsive-image';

interface ResourceCardProps {
  title: string;
  description: string;
  url?: string;
  href?: string;
  icon?: string;
  iconType?: 'emoji' | 'image';
  featured?: boolean;
}

interface FriendLinkCardProps {
  name?: string;
  title?: string;
  description: string;
  url?: string;
  href?: string;
  avatar?: string;
  icon?: string;
  iconType?: 'emoji' | 'image';
}
import { CodeBlock } from '@/components/ui/code-block';
import { InlineCode } from '@/styles/inline-code';
import { MarkdownLink } from '@/styles/markdown-link';
import { UnifiedCard } from '@/components/ui/unified-card';
import { UnifiedGrid } from '@/components/ui/unified-grid';
import { NavigationGrid, NavigationItem } from '@/components/mdx/navigation-grid';
import { FriendLinkItem } from '@/components/mdx/friend-link-grid';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(_components: Record<string, React.ComponentType>) {
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <article className="prose prose-neutral dark:prose-invert max-w-none prose-table:w-full">
        {children}
      </article>
    ),
    // 图片组件 - 使用响应式图片组件
    img: ({ src, alt, width, height, ...props }: ImageProps) => {
      const imageConfig: {
        width: number;
        height: number;
        imageSizes: ResponsiveImageSizes;
        formats: ResponsiveImageFormats;
        style: { width: '100%'; height: 'auto' };
        className: string;
        lazy: boolean;
        containerClassName: string;
        quality: number;
        placeholder: React.ReactNode;
      } = {
        width: Number(width) || 1080,
        height: Number(height) || 500,
        imageSizes: {
          mobile: 640,
          tablet: 1024,
          desktop: 1920,
        },
        formats: {
          webp: true,
          avif: true,
          original: true,
        },
        style: { width: '100%', height: 'auto' } as const,
        className: "rounded-lg border border-border my-8 shadow-sm",
        lazy: true,
        containerClassName: "my-8",
        quality: 85,
        placeholder: (
          <div className="w-full h-full bg-muted/30 rounded-lg border border-border animate-pulse" />
        ),
      };

      if (typeof src === 'string') {
        return (
          <ResponsiveImage
            {...props}
            {...imageConfig}
            src={src}
            alt={alt || ''}
          />
        );
      }

      const imgSrc = (src as StaticImageData).src || src;
      const imgWidth = (src as StaticImageData).width || imageConfig.width;
      const imgHeight = (src as StaticImageData).height || imageConfig.height;

      return (
        <img
          src={imgSrc as string}
          alt={alt || ''}
          width={imgWidth}
          height={imgHeight}
          className={`${imageConfig.className} w-full h-auto`}
          {...props}
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

    // 表格组件
    table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
      <table className="w-full border-collapse my-6 overflow-hidden rounded-lg" {...props}>
        {children}
      </table>
    ),

    thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className="bg-muted border-b border-border" {...props}>
        {children}
      </thead>
    ),

    tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody className="divide-y divide-border" {...props}>
        {children}
      </tbody>
    ),

    tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr className="divide-x divide-border" {...props}>
        {children}
      </tr>
    ),

    th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
      <th className="p-3 text-left font-semibold" {...props}>
        {children}
      </th>
    ),

    td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
      <td className="p-3" {...props}>
        {children}
      </td>
    ),

    // 使用自定义代码块组件 - 懒加载
    pre: ({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
      return (
        <CodeBlock className={className} {...props}>
          {children}
        </CodeBlock>
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
    ResourceCard: (props: ResourceCardProps) => (
      <UnifiedCard
        {...props}
        type="resource"
        title={props.title || ''}
        href={props.url || props.href || '#'}
        iconType={props.iconType || 'emoji'}
        isExternal={true}
      />
    ),

    // 友情链接组件
    FriendLinkCard: (props: FriendLinkCardProps) => (
      <UnifiedCard
        {...props}
        type="friend"
        title={props.name || props.title || ''}
        href={props.url || props.href || '#'}
        icon={props.avatar || props.icon}
        iconType={props.iconType || 'emoji'}
        isExternal={true}
      />
    ),

    // 直接使用统一组件
    UnifiedCard,
    UnifiedGrid,

    // 新的模块化组件
    NavigationGrid,
    NavigationItem,
    FriendLinkItem,
  };
}