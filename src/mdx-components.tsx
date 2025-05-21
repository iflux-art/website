import React from 'react';
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
// 导入所有必要的组件
import { mdxTypographyComponents, MDXTypography } from '@/components/ui/markdown/mdx-typography'
import { DirectCodeBlock } from '@/components/ui/markdown/code-block/direct-code-block'
import { InlineCode } from '@/components/ui/markdown/inline-code'
import { calloutComponents } from '@/components/ui/markdown/callout'
import { enhancedTableComponents } from '@/components/ui/markdown/enhanced-table'
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

  // 代码块组件 - 使用 DirectCodeBlock 组件
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className={cn("overflow-x-auto bg-transparent border-0", className)} {...props} />
  ),
  code: ({ className, ...props }: any) => {
    // 从className中提取语言信息
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : undefined;

    // 添加调试信息
    console.log('MDX 代码块处理:', { className, language, hasChildren: !!props.children });

    // 如果有language类，说明这是一个代码块
    if (language) {
      // 使用 DirectCodeBlock 组件
      return (
        <DirectCodeBlock language={language}>
          {props.children}
        </DirectCodeBlock>
      );
    } else {
      // 内联代码 - 使用 InlineCode 组件
      // 添加调试信息
      console.log('内联代码处理:', {
        children: props.children,
        childrenType: typeof props.children,
        className
      });

      // 使用专门的内联代码组件
      return (
        <InlineCode className={className}>
          {props.children}
        </InlineCode>
      );
    }
  },

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