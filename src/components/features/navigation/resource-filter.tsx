"use client";

import React from "react";

/**
 * 资源过滤组件属性
 *
 * @interface ResourceFilterProps
 */
interface ResourceFilterProps {
  /**
   * 可选的分类列表
   */
  categories: string[];

  /**
   * 当前选中的分类，null 表示全部
   */
  selectedCategory: string | null;

  /**
   * 选择分类的回调函数
   * @param category 选中的分类，null 表示全部
   */
  onSelectCategory: (category: string | null) => void;
}

/**
 * 资源过滤组件
 *
 * 用于在导航页面中筛选不同类别的资源，支持选择全部或特定分类
 *
 * @param {ResourceFilterProps} props - 组件属性
 * @returns {JSX.Element} 资源过滤组件
 *
 * @example
 * ```tsx
 * <ResourceFilter
 *   categories={["编辑器", "版本控制", "部署"]}
 *   selectedCategory={selectedCategory}
 *   onSelectCategory={setSelectedCategory}
 * />
 * ```
 */
export function ResourceFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: ResourceFilterProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-3">按分类筛选</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-primary/10 hover:text-primary'}`}
        >
          全部
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-primary/10 hover:text-primary'}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}