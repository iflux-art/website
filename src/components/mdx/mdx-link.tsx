'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';
import { cn } from '@/utils';
import MDXConfig from '@/config/mdx';

/**
 * MDX链接组件的属性定义
 */
export interface MDXLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 链接地址 */
  href: string;
  /** 链接内容 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否强制作为外部链接处理 */
  external?: boolean;
  /** 是否在新标签页打开 */
  openInNewTab?: boolean;
  /** 是否显示外部链接图标 */
  showExternalIcon?: boolean;
}

// Styles
const styles = {
  /** 基础链接样式 */
  base: 'relative inline-flex items-center gap-1 text-primary no-underline transition-colors hover:text-primary/80',
  /** 外部链接样式 */
  external: 'cursor-alias',
  /** 图标样式 */
  icon: 'h-3 w-3',
  /** 下划线动画样式 */
  underline:
    'after:absolute after:left-1/2 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:left-0 hover:after:w-full',
} as const;

// Utils
const isExternalLink = (href: string): boolean => {
  return href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
};

/**
 * MDX 链接组件
 *
 * 支持内部和外部链接，自动处理：
 * - 外部链接图标
 * - 新标签页打开
 * - 下划线动画效果
 */
export const MDXLink: React.FC<MDXLinkProps> = ({
  href,
  children,
  className,
  external,
  openInNewTab,
}) => {
  if (!href) return null;

  // 确定链接类型和行为
  const isExternal = external ?? isExternalLink(href);
  const showExternalIcon = MDXConfig.options.link.externalIcon ?? true;
  const showUnderline = MDXConfig.options.link.underline ?? true;
  const openExternal = openInNewTab ?? MDXConfig.options.link.openExternalInNewTab ?? true;

  // 组合样式类名
  const linkClasses = cn(
    styles.base,
    isExternal && styles.external,
    showUnderline && styles.underline,
    className
  );

  // 渲染外部链接
  if (isExternal) {
    return (
      <a
        href={href}
        className={linkClasses}
        target={openExternal ? '_blank' : undefined}
        rel="noopener noreferrer"
      >
        {children}
        {showExternalIcon && <ExternalLinkIcon className={styles.icon} />}
      </a>
    );
  }

  // 渲染内部链接
  return (
    <Link href={href} className={linkClasses}>
      {children}
    </Link>
  );
};
