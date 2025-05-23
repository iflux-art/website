'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Markdown 链接组件
 *
 * 用于在 Markdown 内容中显示链接，支持内部链接和外部链接
 * 提供中心向外扩散的下划线动画效果
 *
 * @param href - 链接地址
 * @param children - 链接内容
 * @param className - 额外的类名
 * @param noUnderline - 是否禁用下划线效果
 * @param isExternal - 是否为外部链接
 */
export interface MarkdownLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: React.ReactNode;
  className?: string;
  noUnderline?: boolean;
  isExternal?: boolean;
}

export function MarkdownLink({
  href,
  children,
  className,
  noUnderline = false,
  isExternal = false,
  ...props
}: MarkdownLinkProps) {
  const linkClasses = cn(
    'text-primary transition-colors duration-300 font-medium',
    !noUnderline && 'relative group',
    className
  );

  const content = (
    <>
      {children}
      {!noUnderline && (
        <span className="absolute bottom-0 left-[50%] right-[50%] h-[1.5px] bg-primary opacity-80 group-hover:left-0 group-hover:right-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
      )}
    </>
  );

  if (
    isExternal ||
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return (
      <a href={href} className={linkClasses} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClasses} {...props}>
      {content}
    </Link>
  );
}

/* 超链接样式 - 用于全局样式表引用 */
export const markdownLinkStyles = `
  /* 超链接样式 */
  .prose a:not(.no-underline):not(.btn):not(.card):not([role="tab"]) {
    color: hsl(var(--primary)); /* 使用主题变量 */
    text-decoration: none; /* 默认不带下划线 */
    position: relative;
    transition: color 0.3s ease;
    padding-bottom: 1px; /* 为下划线留出空间 */
  }

  /* 超链接悬停效果 - 使用统一的交互效果 */
  .prose a:not(.no-underline):not(.btn):not(.card):not([role="tab"])::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    right: 50%;
    height: 1.5px;
    background-color: hsl(var(--primary));
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1); /* 非线性动画 */
    opacity: 0.8;
  }

  /* 超链接悬停时下划线从中心向两侧扩散 */
  .prose a:not(.no-underline):not(.btn):not(.card):not([role="tab"]):hover::after {
    left: 0;
    right: 0;
  }

  /* 暗色模式下的超链接颜色 - 使用主题变量，不需要单独设置 */
  .dark .prose a:not(.no-underline):not(.btn):not(.card):not([role="tab"]) {
    color: hsl(var(--primary)); /* 使用主题变量 */
    font-weight: 500; /* 加粗一点，提高可读性 */
  }
`;
