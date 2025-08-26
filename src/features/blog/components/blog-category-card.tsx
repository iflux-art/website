"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryWithCount } from "@/features/blog/types";
import { cn } from "@/utils";
import { Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export interface BlogCategoryCardProps {
  categories?: CategoryWithCount[];
  selectedCategory?: string;
  onCategoryClick?: (category: string | null) => void;
  className?: string;
  /**
   * 是否启用路由功能
   * @default false
   */
  enableRouting?: boolean;
  /**
   * 是否显示标题栏
   * @default true
   */
  showHeader?: boolean;
}

/**
 * 博客分类卡片组件
 *
 * 以卡片形式显示博客分类，支持点击筛选功能
 */
export const BlogCategoryCard = ({
  categories = [],
  selectedCategory,
  onCategoryClick,
  className,
  enableRouting = false,
  showHeader = true,
}: BlogCategoryCardProps) => {
  const router = useRouter();

  // 按文章数量降序排列分类
  const sortedCategories = React.useMemo(
    () => [...categories].sort((a, b) => b.count - a.count),
    [categories]
  );

  const handleClick = (category: string | null) => {
    if (enableRouting) {
      if (category) {
        router.push(`/blog?category=${encodeURIComponent(category)}`);
      } else {
        router.push("/blog");
      }
    }
    onCategoryClick?.(category);
  };

  return (
    <Card className={cn("w-full", className)}>
      {showHeader && (
        <CardHeader className="pt-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Folder className="h-3.5 w-3.5 text-primary" />
            分类
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showHeader ? "pt-0 pb-4" : "py-4"}>
        <div className="hide-scrollbar max-h-[250px] space-y-1.5 overflow-y-auto sm:max-h-[300px] sm:space-y-2">
          {/* 分类列表 - 按文章数量降序排列 */}
          {sortedCategories.map(category => {
            const isSelected = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                type="button"
                onClick={() => handleClick(isSelected ? null : category.name)}
                className={cn(
                  "flex min-h-[44px] w-full touch-manipulation items-center gap-2 rounded-md px-2.5 py-2.5 text-left text-sm transition-colors sm:min-h-[36px] sm:px-3 sm:py-2",
                  isSelected
                    ? "bg-primary font-medium text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground active:bg-muted/80"
                )}
              >
                <Folder className="h-3.5 w-3.5" />
                <span className="flex-1">
                  {category.name} <span className="text-xs opacity-70">({category.count})</span>
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
