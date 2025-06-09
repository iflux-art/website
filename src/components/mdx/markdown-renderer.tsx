import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image, { ImageProps } from 'next/image';
import { CodeBlock } from '@/components/ui/code-block';
import { InlineCode } from '@/styles/inline-code';
import { MarkdownLink } from '@/styles/markdown-link';
import { UnifiedCard } from '@/components/ui/unified-card';
import { UnifiedGrid } from '@/components/ui/unified-grid';
interface ResourceCardProps {
  title: string;
  description?: string;
  url?: string;
  href?: string;
  icon?: string;
  iconType?: 'emoji' | 'image';
  featured?: boolean;
  [key: string]: unknown;
}

interface ResourceGridProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface FriendLinkCardProps {
  name?: string;
  title: string;
  description?: string;
  url?: string;
  href?: string;
  avatar?: string;
  icon?: string;
  iconType?: 'emoji' | 'image';
  [key: string]: unknown;
}
/**
 * MDX 组件映射
 * 定义在 Markdown/MDX 内容中可以使用的组件
 */
export const mdxComponents = {
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

  // 表格组件
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse border border-border">{children}</table>
    </div>
  ),
  
  // 表头
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">{children}</th>
  ),
  
  // 表格单元格
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="border border-border px-4 py-2">{children}</td>
  ),
  
  // 表格行
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="m-0 border-t border-border p-0 even:bg-muted">{children}</tr>
  ),
  
  // 表格主体
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
  ),
  
  // 表格头部
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  ),

  // 统一卡片组件
  ResourceCard: (props: ResourceCardProps) => (
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
  ResourceGrid: (props: ResourceGridProps) => <UnifiedGrid {...props} type="resource" />,

  // 友情链接组件
  FriendLinkCard: (props: FriendLinkCardProps) => (
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
  FriendLinkGrid: (props: ResourceGridProps) => <UnifiedGrid {...props} type="friend" />,

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
 * ```tsx
 * <MarkdownRenderer content="# Hello World" />
 * ```
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return <MDXRemote source={content} components={mdxComponents} />;
}
/**
 * 处理 MDX 内容中的自定义组件标签
 * 将自定义组件标签转换为对应的 HTML 数据属性标记
 */
export function processMdxContent(content: string): string {
  return (
    content
      // 确保 Markdown 标题正确渲染
      .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mb-6 tracking-tight">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold mb-4 mt-8 tracking-tight">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-bold mb-3 mt-6">$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4 class="text-xl font-bold mb-2 mt-4">$1</h4>')

      // 处理各种自定义组件
      .replace(/<(Resource|FriendLink|Unified)(Grid|Card)([^>]*)\/?>/g, '<div data-$1-$2$3>')
      .replace(/<\/(Resource|FriendLink|Unified)(Grid|Card)>/g, '</div>')
  );
}

/**
 * @deprecated 请使用 MarkdownRenderer 替代 ServerMDX，ServerMDX 将在未来版本中移除
 */
export { MarkdownRenderer as ServerMDX };