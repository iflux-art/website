'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  currentDoc?: string;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  target?: string;
  rel?: string;
  _isNavigation?: boolean;
};

/**
 * 导航链接组件
 *
 * 用于在导航菜单中显示当前活动页面的链接，支持多种匹配方式
 *
 * @example
 * ```tsx
 * <NavLink
 *   href="/docs/getting-started"
 *   currentDoc="installation"
 * >
 *   安装指南
 * </NavLink>
 * ```
 */
/**
 * 导航链接组件
 *
 * 用于在导航菜单中显示当前活动页面的链接，支持多种匹配方式
 *
 * @example
 * ```tsx
 * <NavLink
 *   href="/docs/getting-started"
 *   currentDoc="installation"
 * >
 *   安装指南
 * </NavLink>
 * ```
 */
export function NavLink({
  href,
  children,
  currentDoc,
  className = '',
  activeClassName = 'bg-accent text-accent-foreground font-medium',
  inactiveClassName = 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
  onClick,
  onMouseEnter,
  onMouseLeave,
  target,
  rel,
  _isNavigation = false,
}: NavLinkProps) {
  const pathname = usePathname();

  // 确定链接是否处于活动状态
  let isActive = pathname === href;

  // 如果不是完全匹配，尝试使用更灵活的匹配方式
  if (!isActive && currentDoc) {
    // 方法1: 直接比较当前文档名称
    if (href.endsWith(`/${currentDoc}`)) {
      isActive = true;
    }

    // 方法2: 从 href 中提取文档路径部分
    if (!isActive) {
      const hrefSegments = href.split('/').filter(Boolean);
      const lastSegment = hrefSegments[hrefSegments.length - 1];

      // 检查是否匹配当前文档
      if (lastSegment === currentDoc) {
        isActive = true;
      }
    }

    // 方法3: 检查路径前缀
    if (!isActive && pathname.startsWith(href) && href !== '/') {
      isActive = true;
    }
  }

  // 使用原始链接，不自动添加前缀
  const finalHref = href;

  return (
    <Link
      href={finalHref}
      className={cn(
        'flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
        className,
        isActive ? activeClassName : inactiveClassName
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
}

/**
 * @deprecated 请使用 NavLink 替代 ActiveLink，ActiveLink 将在未来版本中移除
 */
export { NavLink as ActiveLink };
