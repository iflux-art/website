"use client";

import React from "react";
import { BlogCard } from "@/features/blog/components";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/features/blog/types";

/**
 * 文章网格组件属性
 */
interface ArticleGridProps {
  /** 要显示的文章列表 */
  posts: BlogPost[];
  /** 自定义类名 */
  className?: string;
  /** 标签点击回调 */
  onTagClick?: (tag: string) => void;
}

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
function formatDate(date: string | Date | undefined): string {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 响应式文章网格组件
 *
 * 功能特性：
 * - 响应式网格布局：桌面4列，平板3列，移动2列/1列
 * - 复用现有的 BlogCard 组件显示文章信息
 * - 支持标签点击事件
 * - 自适应间距和布局
 */
export function ArticleGrid({
  posts,
  className,
  onTagClick,
}: ArticleGridProps) {
  return (
    <div
      className={cn(
        // 基础网格样式
        "grid gap-4",
        // 响应式列数：移动1列，小屏2列，中屏3列，大屏4列，超大屏5列
        // 优化大屏幕显示效果
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
        // 自定义类名
        className,
      )}
    >
      {posts.map((post) => (
        <BlogCard
          key={post.slug}
          title={post.title}
          description={post.description}
          href={`/blog/${post.slug}`}
          image={post.image}
          tags={post.tags}
          date={formatDate(post.date)}
          author={post.author}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}
