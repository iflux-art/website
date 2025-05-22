"use client";

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
 * 
 * @param level - 标题级别 (1-6)
 * @param id - 标题 ID，用于锚点链接
 * @param children - 标题内容
 * @param className - 额外的类名
 */
export function Heading({ level, id, children, className, ...props }: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Component
      id={id}
      className={cn(
        "relative group",
        className
      )}
      {...props}
    >
      {children}
      <a
        href={id ? `#${id}` : '#'}
        className="absolute left-[-1.5rem] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-70 text-[0.9em] w-[1rem] text-center"
        aria-hidden="true"
      >
        #
      </a>
    </Component>
  );
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
  }

  /* 标题悬停效果 - 简单版本 */
  .prose h1:hover::before,
  .prose h2:hover::before,
  .prose h3:hover::before,
  .prose h4:hover::before,
  .prose h5:hover::before,
  .prose h6:hover::before {
    content: "#";
    position: absolute;
    left: -1.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: inherit; /* 使用与标题相同的颜色 */
    opacity: 0.7;
    font-weight: inherit; /* 使用与标题相同的字重 */
    font-size: 0.9em; /* 稍微小一点的字体大小 */
    line-height: 1;
    text-align: center;
    width: 1rem; /* 固定宽度，确保对齐 */
  }
`;
