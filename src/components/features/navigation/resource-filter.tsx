"use client";

import React from "react";

interface ResourceFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

/**
 * 资源过滤组件
 * 用于在导航页面中筛选不同类别的资源
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