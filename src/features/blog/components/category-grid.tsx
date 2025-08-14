"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 内联类型定义
interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryGridProps {
  /** 分类列表 */
  categories: Category[];
  /** 分类点击回调 */
  onCategoryClick: (category: string) => void;
  /** 当前选中的分类 */
  selectedCategory?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 分类网格组件
 *
 * 功能特性：
 * - 响应式网格布局
 * - 显示分类名称和文章数量
 * - 悬停效果和点击反馈
 * - 按文章数量排序显示
 */
export function CategoryGrid({
  categories,
  onCategoryClick,
  selectedCategory,
  className,
}: CategoryGridProps) {
  // 按文章数量降序排序
  const sortedCategories = React.useMemo(() => {
    return [...categories].sort((a, b) => b.count - a.count);
  }, [categories]);

  if (categories.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
        <div className="mb-4 text-4xl opacity-50">📂</div>
        <h3 className="mb-2 text-lg font-medium">暂无分类</h3>
        <p className="text-sm text-muted-foreground">还没有创建任何文章分类</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        // 响应式网格布局
        "grid gap-4",
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {sortedCategories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.name ? "default" : "outline"}
          size="lg"
          onClick={() => onCategoryClick(category.name)}
          className={cn(
            // 基础样式
            "h-auto flex-col items-center justify-center p-6 text-center",
            "transition-all duration-200 ease-in-out",
            // 悬停效果
            "hover:scale-105 hover:shadow-lg",
            // 选中状态
            selectedCategory === category.name && "ring-2 ring-primary/20",
          )}
        >
          {/* 分类名称 */}
          <div className="mb-2 text-lg font-semibold">{category.name}</div>

          {/* 文章数量 */}
          <div className="text-sm opacity-70">{category.count} 篇文章</div>
        </Button>
      ))}
    </div>
  );
}
