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
import { HeadingWithAnchor } from '@/components/ui/markdown/heading-with-anchor'

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

  // 覆盖标题组件，使用带锚点的标题组件
  h1: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <HeadingWithAnchor level={1} id={id} {...props}>{children}</HeadingWithAnchor>;
  },
  h2: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <HeadingWithAnchor level={2} id={id} {...props}>{children}</HeadingWithAnchor>;
  },
  h3: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <HeadingWithAnchor level={3} id={id} {...props}>{children}</HeadingWithAnchor>;
  },
  h4: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <HeadingWithAnchor level={4} id={id} {...props}>{children}</HeadingWithAnchor>;
  },

  // 覆盖段落组件处理逻辑
  p: ({ children }: MDXChildrenProps) => {
    // 检查子元素是否包含任何块级元素
    const hasBlockElement = React.Children.toArray(children).some(child => {
      if (!React.isValidElement(child)) return false;

      const props = child.props as MDXProps;
      // 获取子元素的类型，可能是字符串、函数或对象
      const childType = child.type;

      // 检查常见块级元素类型
      const blockTypes = ['div', 'pre', 'ul', 'ol', 'table', 'blockquote'];

      // 特别检查code元素，如果它有language-类，则视为代码块
      if (childType === 'code' && props.className?.includes('language-')) {
        return true;
      }

      // 检查是否为Image组件（可能是img标签被转换后的组件）
      if (childType === 'img' || childType === 'Image' ||
          (typeof childType === 'string' && childType.includes('Image'))) {
        return true;
      }

      return (typeof childType === 'string' && blockTypes.includes(childType)) ||
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
  img: (props: ImageProps) => {
    // 创建一个不包含div的图片组件，避免在p标签内嵌套div
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