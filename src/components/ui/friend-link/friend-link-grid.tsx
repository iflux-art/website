'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface FriendLinkGridProps {
  /**
   * 子元素
   */
  children: React.ReactNode;
  
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
 * 用于在 MDX 文件中显示友情链接卡片网格
 */
export function FriendLinkGrid({
  children,
  className,
  columns = 3,
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
      {children}
    </div>
  );
}
