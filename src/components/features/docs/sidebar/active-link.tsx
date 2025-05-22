'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ActiveLinkProps {
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
}

/**
 * 带有活动状态的链接组件
 *
 * 用于在侧边栏中显示当前活动页面的链接
 */
export function ActiveLink({
  href,
  children,
  currentDoc,
  className = '',
  activeClassName = 'bg-accent/50 text-foreground font-medium',
  inactiveClassName = 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
  onClick,
  onMouseEnter,
  onMouseLeave,
  target,
  rel,
}: ActiveLinkProps) {
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

  // 调试信息
  console.log(
    `ActiveLink: href=${href}, pathname=${pathname}, currentDoc=${currentDoc}, isActive=${isActive}`
  );

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between py-2 px-2 rounded-md text-sm transition-colors duration-200',
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
