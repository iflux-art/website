/**
 * 文章卡片组件
 * 用于在列表页或首页展示文章摘要
 * 内联所有相关类型和逻辑，避免过度抽象
 */

"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";

// 内联文章卡片相关类型定义
interface BlogCardProps {
  title: string;
  description?: string;
  href: string;
  tags?: string[];
  image?: string;
  date?: string;
  author?: string;
  className?: string;
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
      tags = [],
      image,
      date,
      author,
      className,
      onTagClick,
    },
    ref,
  ) => {
    return (
      <Link ref={ref} href={href} className="block h-full">
        <Card
          className={cn(
            "group h-full border p-5 transition-all duration-300 hover:scale-[1.01] hover:border-primary/50",
            className,
          )}
        >
          {image && (
            <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                unoptimized
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col">
            <h2 className="mb-1 line-clamp-2 text-xl leading-tight font-bold">
              {title}
            </h2>
            {description && (
              <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-muted-foreground/20 text-xs hover:bg-accent/50"
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
          </div>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            {date && <span>{date}</span>}
            {author && <span className="ml-2 truncate">· {author}</span>}
          </div>
        </Card>
      </Link>
    );
  },
);

BlogCard.displayName = "BlogCard";
