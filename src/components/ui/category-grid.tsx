'use client';

import React from 'react';
import { Category, CategoryCard } from '@/components/ui/cards/category-card';

/**
 * 分类网格组件属性
 */
export interface CategoryGridProps {
  /**
   * 分类列表
   */
  categories: Category[];

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义链接文本
   */
  linkText?: string;

  /**
   * 列数配置
   */
  columns?: {
    /**
     * 移动端列数，默认为1
     */
    sm?: number;

    /**
     * 平板列数，默认为2
     */
    md?: number;

    /**
     * 桌面端列数，默认为3
     */
    lg?: number;
  };
}

/**
 * 分类网格组件
 *
 * 用于显示分类列表，包含动画效果和响应式布局
 *
 * @example
 * ```tsx
 * <CategoryGrid
 *   categories={[
 *     {
 *       id: "getting-started",
 *       title: "入门指南",
 *       description: "快速上手项目的基本使用方法",
 *       count: 5
 *     }
 *   ]}
 * />
 * ```
 */
export function CategoryGrid({
  categories,
  className = '',
  linkText,
  columns = { sm: 1, md: 2, lg: 3 },
}: CategoryGridProps) {
  // 构建响应式列数类名
  const gridColumns = `grid-cols-${columns.sm || 1} md:grid-cols-${columns.md || 2} lg:grid-cols-${
    columns.lg || 3
  }`;

  // 使用 React.Fragment 包装子元素，避免额外的 DOM 元素
  const gridContent = (
    <div className={`grid ${gridColumns} gap-6 ${className}`}>
      {categories.map((category, index) => (
        <CategoryCard key={category.id} category={category} index={index} linkText={linkText} />
      ))}
    </div>
  );

  return <div>{gridContent}</div>;
}

/**
 * @deprecated 请使用 CategoryGrid 替代 DocsList，DocsList 将在未来版本中移除
 */
export { CategoryGrid as DocsList };
