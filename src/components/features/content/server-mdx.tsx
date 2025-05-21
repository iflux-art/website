import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import { CodeBlock, InlineCode } from '@/components/ui/markdown';

// 定义服务器端 MDX 组件
const components = {
  // 基础包装器
  wrapper: ({ children }: { children: React.ReactNode }) => (
    <div className="prose dark:prose-invert max-w-none">
      {children}
    </div>
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

  // 代码块组件
  pre: ({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    return (
      <CodeBlock
        className={className}
        {...props}
      >
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
};

interface ServerMDXProps {
  content: string;
}

export function ServerMDX({ content }: ServerMDXProps) {
  return <MDXRemote source={content} components={components} />;
}
