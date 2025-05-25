'use client';

import React, { Children, cloneElement, isValidElement } from 'react';
import { useMasonryAnimation } from '@/hooks/use-masonry-animation';

interface AnimatedGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * 带动画的网格组件
 * 
 * 为MDX中的网格布局添加交错动画效果
 */
export function AnimatedGrid({ children, columns = 3, className = '' }: AnimatedGridProps) {
  // 使用瀑布流动画钩子
  const { registerElement, getItemStyle } = useMasonryAnimation({
    staggerDelay: 120,
    initialDelay: 200,
    columnsCount: columns,
  });

  // 网格列数样式
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  // 将子元素转换为数组并添加动画
  const childrenArray = Children.toArray(children);
  const animatedChildren = childrenArray.map((child, index) => {
    if (isValidElement(child)) {
      return (
        <div
          key={index}
          ref={el => registerElement(index, el)}
          style={getItemStyle(index)}
        >
          {child}
        </div>
      );
    }
    return child;
  });

  return (
    <div className={`grid gap-6 my-8 ${gridCols[columns]} ${className}`}>
      {animatedChildren}
    </div>
  );
}

// 为了兼容现有的MDX组件，提供别名
export const FriendLinkGrid = AnimatedGrid;
export const ResourceGrid = AnimatedGrid;
