'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getCategoryCardClasses } from '@/lib/color-utils';

/**
 * 分类颜色卡片组件属性
 */
export interface CategoryColorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 颜色名称
   */
  color: string;
  
  /**
   * 子元素
   */
  children: React.ReactNode;
  
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 分类颜色卡片组件
 * 
 * 用于创建带有特定颜色的卡片，主要用于导航页面的分类卡片
 * 
 * @example
 * ```tsx
 * <CategoryColorCard color="blue">
 *   <CardContent>
 *     <h3>标题</h3>
 *     <p>描述</p>
 *   </CardContent>
 * </CategoryColorCard>
 * ```
 */
export function CategoryColorCard({ color, children, className, ...props }: CategoryColorCardProps) {
  // 获取颜色类名
  const colorClasses = getCategoryCardClasses(color);
  
  return (
    <Card 
      className={cn(
        'transition-all duration-300 hover:shadow-lg border-2',
        colorClasses,
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
