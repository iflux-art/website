import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image, { ImageProps } from 'next/image';
import { CodeBlock } from '@/components/ui/markdown/code-block';
import { InlineCode } from '@/components/ui/markdown/inline-code';
import { MarkdownLink } from '@/components/ui/markdown/link';
import { FriendLinkCard, FriendLinkGrid } from '@/components/ui/friend-link/friend-link-card';
import { ResourceCard } from '@/components/ui/resource/resource-card';
import { ResourceGrid } from '@/components/ui/resource/resource-grid';

/**
 * Markdown 渲染器组件属性
 */
export interface MarkdownRendererProps {
  /**
   * Markdown 内容字符串
   */
  content: string;
}

// 定义服务器端 MDX 组件
const components = {
  // 基础包装器
  wrapper: ({ children }: { children: React.ReactNode }) => (
    <div className="prose dark:prose-invert prose-neutral max-w-none">{children}</div>
  ),

  // 图片组件
  img: (props: ImageProps) => {
    return (
      <Image
        {...(props as ImageProps)}
        width={props.width || 1080}
        height={props.height || 500}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className="rounded-lg border border-border my-8 shadow-sm"
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

  // 代码块组件
  pre: ({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    return (
      <CodeBlock className={className} {...props}>
        {children}
      </CodeBlock>
    );
  },

  // 行内代码组件
  code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    // 如果是代码块的一部分，不使用行内代码样式
    if (className?.includes('language-')) {
      return <code className={className}>{children}</code>;
    }

    // 使用行内代码组件
    return <InlineCode className={className}>{children}</InlineCode>;
  },

  // 友情链接组件
  FriendLinkCard,
  FriendLinkGrid,

  // 资源导航组件
  ResourceCard,
  ResourceGrid,
};

/**
 * Markdown 渲染器组件
 *
 * 使用 next-mdx-remote 渲染 Markdown/MDX 内容
 *
 * @example
 * <MarkdownRenderer content="# Hello World" />
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return <MDXRemote source={content} components={components} />;
}

/**
 * @deprecated 请使用 MarkdownRenderer 替代 ServerMDX，ServerMDX 将在未来版本中移除
 */
export { MarkdownRenderer as ServerMDX };
