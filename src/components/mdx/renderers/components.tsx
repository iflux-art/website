import React from 'react';
import Image from 'next/image';
import { CodeBlock } from '@/components/mdx/typography/code-block';
import { UnifiedCard } from '@/components/common/cards/unified-card';
import { UnifiedGrid } from '@/components/layout/unified-grid';
import { MarkdownLink } from '@/components/mdx/typography/markdown-link';
import { InlineCode } from '@/components/mdx/typography/inline-code';
import { MDX_CONFIG } from '../utils/config';

/**
 * 基础渲染组件配置
 * 包含所有默认的组件映射和自定义组件
 */
export const BaseComponents = {
  // 基础 HTML 组件
  pre: CodeBlock,
  code: InlineCode,
  a: MarkdownLink,

  // Next.js 组件
  Image: ({ src, alt, width, height, ...props }: React.ComponentProps<typeof Image>) => {
    if (!src) return null;

    const imgSrc = String(src);
    if (imgSrc.startsWith('http') || imgSrc.startsWith('data:')) {
      // 对于外部链接和 base64 图片，使用原生 img 标签
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={imgSrc} alt={alt || ''} {...props} />;
    }

    return (
      <Image
        src={imgSrc}
        alt={alt || ''}
        width={Number(width) || 1080}
        height={Number(height) || 0}
        sizes={MDX_CONFIG.DEFAULT_IMAGE_SIZES}
        style={{ width: '100%', height: 'auto' }}
        loading="lazy"
        {...props}
      />
    );
  },

  // 自定义组件
  UnifiedCard,
  UnifiedGrid,

  // 表格组件
  table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto">
      <table {...props} className="my-6 w-full">
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead {...props} className="bg-muted/50">
      {children}
    </thead>
  ),

  th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th {...props} className="border px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),

  td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} className="border px-4 py-2">
      {children}
    </td>
  ),
} as const;

export default BaseComponents;
