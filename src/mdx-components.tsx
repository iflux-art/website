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

  // 覆盖段落组件处理逻辑
  p: ({ children }: MDXChildrenProps) => {
    // 检查子元素是否包含任何块级元素
    const hasBlockElement = React.Children.toArray(children).some(child => {
      if (!React.isValidElement(child)) return false;
      
      const props = child.props as MDXProps;
      
      // 检查常见块级元素类型
      const blockTypes = ['div', 'pre', 'ul', 'ol', 'table', 'blockquote'];
      return blockTypes.includes(child.type as string) || 
             (props.mdxType && blockTypes.includes(props.mdxType)) ||
             (props.className?.includes('language-'));
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