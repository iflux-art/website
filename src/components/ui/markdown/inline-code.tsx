'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * 内联代码组件
 *
 * 用于在文本中显示内联代码，支持亮色和暗色模式
 * 自动处理内容中的反引号
 */
export function InlineCode({ children, className, ...props }: InlineCodeProps) {
  // 处理内容，移除反引号
  const processContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string') {
      // 处理所有情况的反引号，包括字符串中间的反引号
      return content
        .split('`')
        .map((part, i) => (i % 2 === 0 ? part : <span key={i}>{part}</span>));
    }
    return content;
  };

  return (
    <code
      className={cn(
        // 基础样式
        'inline-block rounded-lg px-2 py-0.5 mx-1 text-sm font-medium font-mono',
        // 使用主题变量
        'bg-muted border border-border text-foreground',
        // 添加阴影和过渡效果
        'shadow-sm transition-colors',
        className
      )}
      {...props}
    >
      {processContent(children)}
    </code>
  );
}

/* 内联代码样式 - 用于全局样式表引用 */
export const inlineCodeStyles = `
  /* 隐藏行内代码中的反引号 */
  .prose code::before,
  .prose code::after,
  .prose *:not(pre) > code::before,
  .prose *:not(pre) > code::after,
  article code::before,
  article code::after,
  *:not(pre) > code::before,
  *:not(pre) > code::after {
    content: "" !important;
    display: none !important;
  }

  /* 确保行内代码有正确的间距和样式 */
  .prose p code:not(pre code),
  .prose li code:not(pre code),
  .prose h1 code:not(pre code),
  .prose h2 code:not(pre code),
  .prose h3 code:not(pre code),
  .prose h4 code:not(pre code),
  .prose h5 code:not(pre code),
  .prose h6 code:not(pre code),
  .prose blockquote code:not(pre code),
  .prose td code:not(pre code),
  .prose th code:not(pre code) {
    margin: 0;
    padding: 0.15rem 0.6rem;
    border-radius: 0.375rem;
    background-color: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
    color: hsl(var(--foreground));
    font-family: var(--font-geist-mono);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .dark .prose p code:not(pre code),
  .dark .prose li code:not(pre code),
  .dark .prose h1 code:not(pre code),
  .dark .prose h2 code:not(pre code),
  .dark .prose h3 code:not(pre code),
  .dark .prose h4 code:not(pre code),
  .dark .prose h5 code:not(pre code),
  .dark .prose h6 code:not(pre code),
  .dark .prose blockquote code:not(pre code),
  .dark .prose td code:not(pre code),
  .dark .prose th code:not(pre code) {
    background-color: hsl(var(--muted));
    border-color: hsl(var(--border));
    color: hsl(var(--foreground));
  }
`;
