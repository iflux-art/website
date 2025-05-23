'use client';

import React from 'react';

/**
 * Markdown 内容组件属性
 */
export interface MarkdownContentProps {
  /**
   * 子元素，通常是 MDX 内容
   */
  children: React.ReactNode;
  
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * Markdown 内容组件
 * 
 * 为 Markdown/MDX 内容提供基础样式包装
 * 
 * @example
 * <MarkdownContent>
 *   {mdxContent}
 * </MarkdownContent>
 */
export function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div className={`prose dark:prose-invert prose-neutral max-w-none ${className || ''}`}>
      {children}
    </div>
  );
}

/**
 * @deprecated 请使用 MarkdownContent 替代 MDXContent，MDXContent 将在未来版本中移除
 */
export { MarkdownContent as MDXContent };
