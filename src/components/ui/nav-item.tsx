'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * 导航项组件属性
 */
export interface NavItemProps {
  /**
   * 导航项链接
   */
  href: string;

  /**
   * 导航项标签
   */
  label: string;

  /**
   * 是否激活
   */
  isActive?: boolean;

  /**
   * 额外的类名
   */
  className?: string;

  /**
   * 点击处理函数
   */
  onClick?: () => void;

  /**
   * 是否使用动画
   * @default true
   */
  animated?: boolean;

  /**
   * 动画延迟
   * @default 0
   */
  animationDelay?: number;

  /**
   * 是否使用下划线
   * @default true
   */
  underline?: boolean;
}

/**
 * 导航项组件
 *
 * 提供统一的导航项样式和交互效果
 *
 * @example
 * ```tsx
 * <NavItem href="/home" label="首页" isActive={true} />
 * ```
 */
export function NavItem({
  href,
  label,
  isActive = false,
  className,
  onClick,
  animated = true,
  animationDelay = 0,
  underline = true,
}: NavItemProps) {
  // 组合所有样式类名
  const linkClasses = cn(
    'py-2 px-3 rounded-lg',
    isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary',
    underline && 'hover:underline',
    animated && 'transition-all duration-300',
    className
  );

  // 添加动画延迟样式
  const style = animated ? { transitionDelay: `${animationDelay}s` } : undefined;

  return (
    <Link href={href} className={linkClasses} onClick={onClick} style={style}>
      {label}
    </Link>
  );
}

/**
 * 导航项列表组件属性
 */
export interface NavItemListProps {
  /**
   * 导航项列表
   */
  items: {
    href: string;
    label: string;
    key?: string;
  }[];

  /**
   * 当前激活的路径
   */
  activePath?: string;

  /**
   * 额外的类名
   */
  className?: string;

  /**
   * 导航项额外的类名
   */
  itemClassName?: string;

  /**
   * 是否使用动画
   * @default true
   */
  animated?: boolean;

  /**
   * 是否使用水平布局
   * @default true
   */
  horizontal?: boolean;

  /**
   * 是否使用下划线
   * @default true
   */
  underline?: boolean;
}

/**
 * 导航项列表组件
 *
 * 提供统一的导航项列表样式和交互效果
 *
 * @example
 * ```tsx
 * <NavItemList
 *   items={[
 *     { href: '/home', label: '首页' },
 *     { href: '/about', label: '关于' },
 *   ]}
 *   activePath="/home"
 * />
 * ```
 */
export function NavItemList({
  items,
  activePath,
  className,
  itemClassName,
  animated = true,
  horizontal = true,
  underline = true,
}: NavItemListProps) {
  // 检查导航项是否激活
  const isActive = (href: string) => {
    if (!activePath) return false;
    return activePath === href || activePath.startsWith(`${href}/`);
  };

  return (
    <ul className={cn('flex gap-2', horizontal ? 'flex-row items-center' : 'flex-col', className)}>
      {items.map((item, index) => (
        <li key={item.key || item.href}>
          <NavItem
            href={item.href}
            label={item.label}
            isActive={isActive(item.href)}
            className={itemClassName}
            animated={animated}
            animationDelay={index * 0.05}
            underline={underline}
          />
        </li>
      ))}
    </ul>
  );
}