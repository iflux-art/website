import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image, { ImageProps } from 'next/image';
import { CodeBlock } from '@/components/mdx/code-block';
import { InlineCode } from '@/styles/inline-code';
import { MarkdownLink } from '@/styles/markdown-link';
import { UnifiedCard } from '@/components/cards/unified-card';
import { UnifiedGrid } from '@/components/cards/unified-grid';

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

  // 表格组件
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-muted/50">{children}</thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="hover:bg-muted/50 transition-colors">{children}</tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="border border-border px-4 py-2 text-left font-medium text-foreground">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="border border-border px-4 py-2 text-muted-foreground">{children}</td>
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

  // 统一卡片组件
  ResourceCard: (props: any) => (
    <UnifiedCard
      type="resource"
      title={props.title}
      description={props.description}
      href={props.url || props.href}
      icon={props.icon}
      iconType={props.iconType || 'emoji'}
      featured={props.featured}
      isExternal={true}
      {...props}
    />
  ),
  ResourceGrid: (props: any) => <UnifiedGrid {...props} type="resource" />,

  // 友情链接组件
  FriendLinkCard: (props: any) => (
    <UnifiedCard
      type="friend"
      title={props.name || props.title}
      description={props.description}
      href={props.url || props.href}
      icon={props.avatar || props.icon}
      iconType={props.iconType || 'emoji'}
      isExternal={true}
      {...props}
    />
  ),
  FriendLinkGrid: (props: any) => <UnifiedGrid {...props} type="friend" />,

  // 直接使用统一组件
  UnifiedCard,
  UnifiedGrid,
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
 * 处理 MDX 内容中的自定义组件标签
 * 将 <ResourceCard ... /> 转换为 <div data-resource-card ... />
 */
export function processMdxContent(content: string): string {
  return (
    content
      // 确保 Markdown 标题正确渲染
      .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mb-6 tracking-tight">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold mb-4 mt-8 tracking-tight">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-bold mb-3 mt-6">$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4 class="text-xl font-bold mb-2 mt-4">$1</h4>')

      // 处理 ResourceGrid 组件
      .replace(/<ResourceGrid([^>]*)>/g, '<div data-resource-grid$1>')
      .replace(/<\/ResourceGrid>/g, '</div>')

      // 处理 ResourceCard 组件的自闭合标签
      .replace(
        /<ResourceCard([^>]*)\s+featured(\s+[^>]*)?\/>/g,
        '<div data-resource-card$1 data-featured="true"$2></div>'
      )
      .replace(/<ResourceCard([^>]*)\/>/g, '<div data-resource-card$1></div>')

      // 处理 ResourceCard 组件的开始标签
      .replace(
        /<ResourceCard([^>]*)\s+featured(\s+[^>]*)?>/g,
        '<div data-resource-card$1 data-featured="true"$2>'
      )
      .replace(/<ResourceCard([^>]*)>/g, '<div data-resource-card$1>')

      // 处理 ResourceCard 组件的结束标签
      .replace(/<\/ResourceCard>/g, '</div>')

      // 处理 FriendLinkGrid 组件
      .replace(/<FriendLinkGrid([^>]*)>/g, '<div data-friend-link-grid$1>')
      .replace(/<\/FriendLinkGrid>/g, '</div>')

      // 处理 FriendLinkCard 组件
      .replace(/<FriendLinkCard([^>]*)\/>/g, '<div data-friend-link-card$1></div>')
      .replace(/<FriendLinkCard([^>]*)>/g, '<div data-friend-link-card$1>')
      .replace(/<\/FriendLinkCard>/g, '</div>')

      // 处理 UnifiedGrid 组件
      .replace(/<UnifiedGrid([^>]*)>/g, '<div data-unified-grid$1>')
      .replace(/<\/UnifiedGrid>/g, '</div>')

      // 处理 UnifiedCard 组件
      .replace(/<UnifiedCard([^>]*)\/>/g, '<div data-unified-card$1></div>')
      .replace(/<UnifiedCard([^>]*)>/g, '<div data-unified-card$1>')
      .replace(/<\/UnifiedCard>/g, '</div>')
  );
}

/**
 * @deprecated 请使用 MarkdownRenderer 替代 ServerMDX，ServerMDX 将在未来版本中移除
 */
export { MarkdownRenderer as ServerMDX };
