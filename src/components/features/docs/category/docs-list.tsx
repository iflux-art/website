"use client";

import React from 'react';
import { DocCategoryCard } from './doc-category-card';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { DocCategory } from '@/types/docs';

interface DocsListProps {
  /**
   * 文档分类列表
   */
  categories: DocCategory[];
}

/**
 * 文档列表组件
 *
 * 用于显示文档分类列表，包含动画效果
 *
 * @param {DocsListProps} props - 组件属性
 * @returns {JSX.Element} 文档列表组件
 */
export function DocsList({ categories }: DocsListProps) {
  // 使用 React.Fragment 包装子元素，避免额外的 DOM 元素
  const gridContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <DocCategoryCard
          key={category.id}
          category={category}
          index={index}
        />
      ))}
    </div>
  );

  return (
    <AnimatedContainer
      baseDelay={0.1}
      staggerDelay={0.15}
      variant="fade"
      autoWrap={false}
      threshold={0.1}
      rootMargin="0px"
    >
      {gridContent}
    </AnimatedContainer>
  );
}
