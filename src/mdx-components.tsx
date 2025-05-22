'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { CodeBlock, InlineCode } from '@/components/ui/markdown';
import { H1, H2, H3, H4 } from '@/components/ui/markdown/heading-with-anchor';
import { MarkdownLink } from '@/components/ui/markdown/link';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: Record<string, React.ComponentType<any>>) {
  return {
    // 基础包装器，使用 Typography 插件样式
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <article className="prose dark:prose-invert max-w-none pl-8 relative">{children}</article>
    ),

    // 标题组件
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,

    // 图片组件
    img: (props: ImageProps) => {
      return (
        <Image
          {...(props as ImageProps)}
          width={props.width || 1080}
          height={props.height || 500}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          className="rounded-md border my-8"
          alt={props.alt || ''}
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

    // 使用自定义代码块组件
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

    // 使用传入的组件
    ...components,
  };
}
