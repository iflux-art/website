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
        'inline-block rounded-md px-1.5 py-0.5 mx-1 text-sm font-normal font-mono',
        // 浅色模式样式
        'bg-[oklch(0.97_0_0)] border border-[oklch(0.922_0_0)] text-[oklch(0.205_0_0)]',
        // 深色模式样式
        'dark:bg-[oklch(0.269_0_0)] dark:border-[oklch(0.3_0_0/0.3)] dark:text-[oklch(0.922_0_0)]',
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
    padding: 0.15rem 0.5rem;
    border-radius: 0.25rem;
    background-color: oklch(0.97 0 0);
    border: 1px solid oklch(0.922 0 0);
    color: oklch(0.205 0 0);
    font-family: var(--font-geist-mono);
    font-size: 0.9rem;
    font-weight: 400;
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
    background-color: oklch(0.269 0 0);
    border-color: oklch(0.3 0 0 / 0.3);
    color: oklch(0.922 0 0);
  }
`;
