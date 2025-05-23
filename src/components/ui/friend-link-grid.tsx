'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { FriendLinkCard, FriendLinkCardProps } from './friend-link-card';

export interface FriendLinkGridProps {
  /**
   * 友情链接列表（可选）
   */
  links?: FriendLinkCardProps[];

  /**
   * 子组件
   */
  children?: React.ReactNode;

  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * 列数
   * @default 3
   */
  columns?: 1 | 2 | 3 | 4;
}

/**
 * 友情链接网格组件
 *
 * 用于在 MDX 文件中显示友情链接网格
 * 支持两种使用方式：
 * 1. 通过 links 属性传递友情链接列表
 * 2. 通过子组件方式传递 FriendLinkCard 组件
 * 
 * @example
 * ```tsx
 * <FriendLinkGrid columns={3}>
 *   <FriendLinkCard name="示例1" ... />
 *   <FriendLinkCard name="示例2" ... />
 * </FriendLinkGrid>
 * ```
 */
export function FriendLinkGrid({ 
  links, 
  children, 
  className,
  columns = 3 
}: FriendLinkGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  
  return (
    <div 
      className={cn(
        'grid gap-6 my-8',
        gridCols[columns],
        className
      )}
    >
      {links &&
        links.map((link, index) => <FriendLinkCard key={link.url} {...link} index={index} />)}
      {children}
    </div>
  );
}

/**
 * @deprecated 使用 FriendLinkGrid 替代，MDXFriendLinkGrid 将在未来版本中移除
 */
export const MDXFriendLinkGrid = FriendLinkGrid;
