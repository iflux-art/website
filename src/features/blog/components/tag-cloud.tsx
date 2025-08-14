"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 内联类型定义
interface TagWithCount {
  name: string;
  count: number;
  isPopular: boolean;
}

interface TagCloudProps {
  /** 标签列表 */
  tags: TagWithCount[];
  /** 标签点击回调 */
  onTagClick: (tag: string) => void;
  /** 当前选中的标签 */
  selectedTag?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 标签云组件
 *
 * 功能特性：
 * - 标签按使用频率排序
 * - 热门标签使用更大字体
 * - 显示标签名称和文章数量
 * - 流式布局适应不同屏幕尺寸
 * - 悬停效果和点击反馈
 */
export function TagCloud({
  tags,
  onTagClick,
  selectedTag,
  className,
}: TagCloudProps) {
  if (tags.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
        <div className="mb-4 text-4xl opacity-50">🏷️</div>
        <h3 className="mb-2 text-lg font-medium">暂无标签</h3>
        <p className="text-sm text-muted-foreground">还没有创建任何文章标签</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {tags.map((tag) => (
        <Badge
          key={tag.name}
          variant={selectedTag === tag.name ? "default" : "secondary"}
          className={cn(
            // 基础样式
            "cursor-pointer px-3 py-2 transition-all duration-200 ease-in-out",
            // 悬停效果
            "hover:scale-105 hover:shadow-md",
            // 根据是否热门调整字体大小
            tag.isPopular ? "text-base font-medium" : "text-sm",
            // 选中状态
            selectedTag === tag.name
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary/80 text-secondary-foreground hover:bg-primary/10 hover:text-primary",
          )}
          onClick={() => onTagClick(tag.name)}
        >
          {tag.name}
          <span className="ml-2 text-xs opacity-70">({tag.count})</span>
        </Badge>
      ))}
    </div>
  );
}
