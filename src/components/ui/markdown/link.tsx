"use client";

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
export interface MarkdownLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
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
    "text-[oklch(0.5_0.2_240)] dark:text-[oklch(0.7_0.2_240)] transition-colors duration-300",
    !noUnderline && "relative pb-[1px] group",
    className
  );

  const content = (
    <>
      {children}
      {!noUnderline && (
        <span className="absolute bottom-0 left-[50%] right-[50%] h-[1px] bg-current opacity-80 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:left-0 group-hover:right-0" />
      )}
    </>
  );

  if (isExternal || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        className={linkClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
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
    color: oklch(0.5 0.2 240); /* 在黑白模式下都清晰可见的蓝色 */
    text-decoration: none; /* 默认不带下划线 */
    position: relative;
    transition: color 0.3s ease;
    padding-bottom: 1px; /* 为下划线留出空间 */
  }

  /* 超链接悬停效果 */
  .prose a:not(.no-underline):not(.btn):not(.card):not([role="tab"])::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    right: 50%;
    height: 1px;
    background-color: currentColor;
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1); /* 更平滑的非线性动画 */
    opacity: 0.8; /* 稍微透明一点 */
  }

  /* 超链接悬停时下划线从中心向两侧扩散 */
  .prose a:not(.no-underline):not(.btn):not(.card):not([role="tab"]):hover::after {
    left: 0;
    right: 0;
  }

  /* 暗色模式下的超链接颜色 */
  .dark .prose a:not(.no-underline):not(.btn):not(.card):not([role="tab"]) {
    color: oklch(0.7 0.2 240); /* 暗色模式下更亮的蓝色 */
  }
`;
