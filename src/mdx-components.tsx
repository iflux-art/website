import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import { components } from '@/components'
import { mdxTypographyComponents, MDXTypography } from '@/components/markdown/mdx-typography'
import { codeBlockComponents } from '@/components/markdown/code-block'
import { Callout, calloutComponents } from '@/components/markdown/callout'
import { enhancedTableComponents } from '@/components/markdown/enhanced-table'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.
 
export const mdxComponents = {
  // 使用自定义排版组件
  ...mdxTypographyComponents,

  // 覆盖段落组件处理逻辑
  p: ({ children }) => {
    if (typeof children === 'object' && children?.props?.mdxType === 'pre') {
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
  img: (props) => (
    <div className="my-8">
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className="rounded-md border"
        {...(props as ImageProps)}
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
  wrapper: ({ children }) => (
    <MDXTypography>{children}</MDXTypography>
  ),
  
  // 继承其他组件
  ...components,
};