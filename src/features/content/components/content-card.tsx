"use client";

import Link from "next/link";
import { formatDate, formatNumber } from "@/features/content/lib";
import type { ContentItem } from "@/features/content/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";

export interface ContentCardProps {
  /** 内容项 */
  item: ContentItem;
  /** 自定义类名 */
  className?: string;
  /** 是否显示分类标签 */
  showCategory?: boolean;
  /** 是否显示标签 */
  showTags?: boolean;
  /** 是否显示统计信息 */
  showStats?: boolean;
  /** 是否显示摘要 */
  showExcerpt?: boolean;
  /** 点击事件处理 */
  onClick?: () => void;
}

export function ContentCard({
  item,
  className,
  showCategory = true,
  showTags = true,
  showStats = true,
  showExcerpt = true,
  onClick,
}: ContentCardProps) {
  return (
    <Card
      className={cn(
        "h-full overflow-hidden transition-all hover:shadow-lg",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-tight">
          <Link
            href={item.slug}
            className="hover:text-primary transition-colors"
            onClick={e => e.stopPropagation()}
          >
            {item.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        {showExcerpt && item.excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-2">{item.excerpt}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {showCategory && item.category && (
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
          )}
          {showTags &&
            item.tags &&
            item.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <span>{formatDate(item.date || new Date())}</span>
        {showStats && (
          <div className="flex gap-2">
            {item.views !== undefined && (
              <span>
                {formatNumber(item.views)} {item.views === 1 ? "view" : "views"}
              </span>
            )}
            {item.likes !== undefined && (
              <span>
                {formatNumber(item.likes)} {item.likes === 1 ? "like" : "likes"}
              </span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
