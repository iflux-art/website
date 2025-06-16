'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * 导航链接组件属性
 */
export interface NavLinkProps {
  /**
   * 链接地址
   */
  href: string;

  /**
   * 链接内容
   */
  children: React.ReactNode;

  /**
   * 当前文档标识符，用于更灵活的匹配
   */
  currentDoc?: string;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 活动状态的类名
   */
  activeClassName?: string;

  /**
   * 非活动状态的类名
   */
  inactiveClassName?: string;

  /**
   * 点击事件处理函数
   */
  onClick?: () => void;

  /**
   * 鼠标进入事件处理函数
   */
  onMouseEnter?: () => void;

  /**
   * 鼠标离开事件处理函数
   */
  onMouseLeave?: () => void;

  /**
   * 链接目标
   */
  target?: string;

  /**
   * 链接关系
   */
  rel?: string;

  /**
   * 是否为导航类型链接
   * 如果为 true，则不会自动添加 /docs 前缀
   */
  _isNavigation?: boolean;
}

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
        'flex items-center justify-between py-2 px-3 rounded-md text-sm transition-colors',
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
