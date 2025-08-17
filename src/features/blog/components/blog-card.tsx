/**
 * 文章卡片组件
 * 用于在列表页或首页展示文章摘要
 * 内联所有相关类型和逻辑，避免过度抽象
 */

"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 内联文章卡片相关类型定义
interface BlogCardProps {
  title: string;
  description?: string;
  href: string;
  category?: string;
  tags?: string[];
  image?: string;
  date?: string;
  author?: string;
  className?: string;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
}

/**
 * 文章卡片组件
 * 完整的独立实现，包含所有必要的样式和交互逻辑
 */
export const BlogCard = forwardRef<HTMLAnchorElement, BlogCardProps>(
  (
    {
      title,
      description,
      href,
      category,
      tags = [],
      date,
      className,
      onCategoryClick,
      onTagClick,
    },
    ref,
  ) => {
    return (
      <Link ref={ref} href={href} className="block h-full">
        <Card
          className={cn(
            "group h-full border transition-all duration-300 hover:border-primary/50 hover:shadow-lg",
            // 响应式内边距 - 移动端更小的内边距，桌面端更大
            "p-3 sm:p-4 md:p-5 lg:p-6",
            // 移动端触摸优化 - 更大的触摸区域和更好的反馈
            "touch-manipulation active:scale-[0.98]",
            // 移动端最小高度确保一致性
            "h-[240px]",
            className,
          )}
        >
          <div className="flex flex-1 flex-col">
            {/* Category Badge - Above title */}
            {category && (
              <div className="mb-2 sm:mb-3">
                <Badge
                  variant="secondary"
                  className="min-h-[28px] cursor-pointer touch-manipulation px-3 py-1 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onCategoryClick?.(category);
                  }}
                >
                  {category}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h2 className="mb-2 line-clamp-2 text-lg leading-tight font-bold transition-colors group-hover:text-primary sm:mb-3 sm:text-xl">
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:mb-4 sm:line-clamp-3">
                {description}
              </p>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5 sm:mb-3 sm:gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="min-h-[24px] cursor-pointer touch-manipulation border-muted-foreground/20 px-2 py-1 text-xs transition-colors hover:border-primary/30 hover:bg-accent/50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onTagClick?.(tag);
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Spacer to push date to bottom */}
            <div className="flex-1" />

            {/* Date and Author - Bottom right */}
            <div className="flex items-center justify-end text-xs text-muted-foreground sm:text-sm">
              {date && <span>{date}</span>}
            </div>
          </div>
        </Card>
      </Link>
    );
  },
);

BlogCard.displayName = "BlogCard";
