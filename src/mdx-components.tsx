import React from 'react';
import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
// 导入所有必要的组件
import { mdxTypographyComponents, MDXTypography } from '@/components/ui/markdown/mdx-typography'
import { codeBlockComponents } from '@/components/ui/markdown/code-block'
import { Callout, calloutComponents } from '@/components/ui/markdown/callout'
import { enhancedTableComponents } from '@/components/ui/markdown/enhanced-table'
import Copy from '@/components/ui/markdown/copy'
import Note from '@/components/ui/markdown/note'
import CustomLink from '@/components/ui/markdown/link'
import CustomImage from '@/components/ui/markdown/image'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

interface MDXProps {
  mdxType?: string;
  className?: string;
  [key: string]: any;
}

type MDXChildrenProps = {
  children: React.ReactNode;
}

export const mdxComponents = {
  // 使用自定义排版组件
  ...mdxTypographyComponents,

  // 覆盖标题组件，确保有ID
  h1: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <h1 id={id} className="text-4xl font-bold tracking-tight mt-8 mb-4 scroll-m-20" {...props}>{children}</h1>;
  },
  h2: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
    return <h2 id={headingId} className="text-2xl font-semibold tracking-tight mt-10 mb-4 pb-2 border-b scroll-m-20" {...props}>{children}</h2>;
  },
  h3: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
    return <h3 id={headingId} className="text-xl font-semibold tracking-tight mt-8 mb-3 scroll-m-20" {...props}>{children}</h3>;
  },
  h4: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
    return <h4 id={headingId} className="text-lg font-semibold tracking-tight mt-8 mb-3 scroll-m-20" {...props}>{children}</h4>;
  },

  // 覆盖段落组件处理逻辑
  p: ({ children }: MDXChildrenProps) => {
    // 检查子元素是否包含任何块级元素
    const hasBlockElement = React.Children.toArray(children).some(child => {
      if (!React.isValidElement(child)) return false;

      const props = child.props as MDXProps;
      const childType = child.type as string;

      // 检查常见块级元素类型
      const blockTypes = ['div', 'pre', 'ul', 'ol', 'table', 'blockquote'];

      // 特别检查code元素，如果它有language-类，则视为代码块
      if (childType === 'code' && props.className?.includes('language-')) {
        return true;
      }

      return blockTypes.includes(childType) ||
             (props.mdxType && blockTypes.includes(props.mdxType));
    });

    if (hasBlockElement) {
      return <>{children}</>
    }
    return <p className="leading-7 my-6">{children}</p>
  },

  // 代码块组件
  ...codeBlockComponents,

  // Callout组件
  ...calloutComponents,

  // 增强表格组件
  ...enhancedTableComponents,

  // 图片组件
  img: (props: ImageProps) => (
    <div className="my-8">
      <Image
        {...(props as ImageProps)}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className="rounded-md border"
        alt={props.alt || ''}
      />
    </div>
  ),

  // 自定义链接组件
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href && !href.startsWith('http') && !href.startsWith('#');

    if (isInternal) {
      return (
        <Link href={href || '#'} {...props} className="text-primary font-medium underline-offset-4 hover:text-primary/80">
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-primary font-medium underline-offset-4 hover:text-primary/80"
        {...props}
      >
        {children}
      </a>
    );
  },

  // 包装器组件，用于包装整个MDX内容
  wrapper: ({ children }: MDXChildrenProps) => (
    <MDXTypography>{children}</MDXTypography>
  ),

};