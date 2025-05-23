'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * 标题级别类型
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 标题组件属性
 */
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  id?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Markdown 标题组件
 *
 * 用于在 Markdown 内容中显示标题，支持锚点链接
 * 简化版本，移除了悬停显示 # 符号的效果
 *
 * @param level - 标题级别 (1-6)
 * @param id - 标题 ID，用于锚点链接
 * @param children - 标题内容
 * @param className - 额外的类名
 */
export function Heading({ level, id, children, className, ...props }: HeadingProps) {
  switch (level) {
    case 1:
      return (
        <h1 id={id} className={cn(className)} {...props}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 id={id} className={cn(className)} {...props}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 id={id} className={cn(className)} {...props}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 id={id} className={cn(className)} {...props}>
          {children}
        </h4>
      );
    case 5:
      return (
        <h5 id={id} className={cn(className)} {...props}>
          {children}
        </h5>
      );
    case 6:
      return (
        <h6 id={id} className={cn(className)} {...props}>
          {children}
        </h6>
      );
    default:
      return (
        <h2 id={id} className={cn(className)} {...props}>
          {children}
        </h2>
      );
  }
}

/* 标题样式 - 用于全局样式表引用 */
export const headingStyles = `
  /* 标题样式 - 简单版本 */
  .prose h1,
  .prose h2,
  .prose h3,
  .prose h4,
  .prose h5,
  .prose h6 {
    position: relative;
    scroll-margin-top: 5rem; /* 为锚点导航添加顶部边距 */
  }
`;
