"use client";

import { cn } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavLinkProps {
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
}

/**
 * 判断链接是否处于活动状态
 */
function isLinkActive(pathname: string, href: string, currentDoc?: string): boolean {
  // 完全匹配
  if (pathname === href) {
    return true;
  }

  // 如果没有 currentDoc，使用前缀匹配（但不匹配根路径）
  if (!currentDoc) {
    return pathname.startsWith(href) && href !== "/";
  }

  // 方法1: 直接比较当前文档名称
  if (href.endsWith(`/${currentDoc}`)) {
    return true;
  }

  // 方法2: 从 href 中提取文档路径部分
  const hrefSegments = href.split("/").filter(Boolean);
  const lastSegment = hrefSegments[hrefSegments.length - 1];
  if (lastSegment === currentDoc) {
    return true;
  }

  // 方法3: 检查路径前缀
  if (pathname.startsWith(href) && href !== "/") {
    return true;
  }

  return false;
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
export const NavLink = ({
  href,
  children,
  currentDoc,
  className = "",
  activeClassName = "bg-accent text-accent-foreground font-medium",
  inactiveClassName = "text-muted-foreground hover:text-foreground hover:bg-accent/50",
  onClick,
  onMouseEnter,
  onMouseLeave,
  target,
  rel,
  _isNavigation = false,
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = isLinkActive(pathname, href, currentDoc);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
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
};

/**
 * @deprecated 请使用 NavLink 替代 ActiveLink，ActiveLink 将在未来版本中移除
 */
export { NavLink as ActiveLink };
