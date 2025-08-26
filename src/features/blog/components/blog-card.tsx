/**
 * 文章卡片组件
 * 用于在列表页或首页展示文章摘要
 * 内联所有相关类型和逻辑，避免过度抽象
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";

// 内联文章卡片相关类型定义
interface BlogCardProps {
  title: string;
  description?: string;
  href: string;
  category?: string;
  tags?: string[];
  cover?: string;
  date?: string;
  author?: string;
  className?: string;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
}

// 分类徽章组件
interface CategoryBadgeProps {
  category: string;
  onCategoryClick?: (category: string) => void;
}

const CategoryBadge = ({ category, onCategoryClick }: CategoryBadgeProps) => (
  <div className="mb-2 sm:mb-3">
    <Badge
      variant="secondary"
      className="min-h-[28px] cursor-pointer touch-manipulation px-3 py-1 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onCategoryClick?.(category);
      }}
    >
      {category}
    </Badge>
  </div>
);

// 标签列表组件
interface TagBadgesProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

const TagBadges = ({ tags, onTagClick }: TagBadgesProps) => (
  <div className="mb-2 flex flex-wrap gap-1.5 sm:mb-3 sm:gap-2">
    {tags.map(tag => (
      <Badge
        key={tag}
        variant="outline"
        className="min-h-[24px] cursor-pointer touch-manipulation border-muted-foreground/20 px-2 py-1 text-xs transition-colors hover:border-primary/30 hover:bg-accent/50"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onTagClick?.(tag);
        }}
      >
        {tag}
      </Badge>
    ))}
  </div>
);

// 封面图片组件
interface CoverImageProps {
  cover: string;
  title: string;
}

const CoverImage = ({ cover, title }: CoverImageProps) => (
  <div
    className="relative hidden flex-shrink-0 overflow-hidden rounded-r-[calc(var(--radius)-1px)] bg-muted/30 lg:block"
    style={{ width: "45%", aspectRatio: "4/3" }}
  >
    <Image
      src={cover}
      alt={`${title} 封面`}
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      sizes="(max-width: 1024px) 0vw, 45vw"
      onError={e => {
        // 图片加载失败时隐藏图片容器
        const img = e.target as HTMLImageElement;
        const container = img.closest("div");
        if (container) {
          container.style.display = "none";
        }
      }}
    />
    {/* 封面渐变遮罩效果 */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
  </div>
);

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
      cover,
      date,
      className,
      onCategoryClick,
      onTagClick,
    },
    ref
  ) => (
    <Link ref={ref} href={href} className="block h-full">
      <Card
        className={cn(
          "group h-full overflow-hidden border transition-all duration-300 hover:border-primary/50 hover:shadow-lg",
          // 移动端触摸优化 - 更大的触摸区域和更好的反馈
          "touch-manipulation active:scale-[0.98]",
          // 移动端最小高度确保一致性
          "h-[240px]",
          className
        )}
      >
        <div className="flex h-full">
          {/* 左侧内容区域 */}
          <div
            className={cn(
              "flex flex-1 flex-col p-3 sm:p-4 md:p-5 lg:p-6",
              // 移动端始终占满宽度，桌面端根据是否有封面调整
              "w-full",
              cover ? "lg:w-auto lg:flex-1" : ""
            )}
          >
            {/* Category Badge - Above title */}
            {category && <CategoryBadge category={category} onCategoryClick={onCategoryClick} />}

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
            {tags.length > 0 && <TagBadges tags={tags} onTagClick={onTagClick} />}

            {/* Spacer to push date to bottom */}
            <div className="flex-1" />

            {/* Date - Bottom left with prefix */}
            <div className="flex items-center text-xs text-muted-foreground sm:text-sm">
              {date && <span>发布于 {date}</span>}
            </div>
          </div>

          {/* 右侧封面图片区域 - 仅在桌面端显示 */}
          {cover && <CoverImage cover={cover} title={title} />}
        </div>
      </Card>
    </Link>
  )
);

BlogCard.displayName = "BlogCard";
