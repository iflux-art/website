"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TagWithCount {
  name: string;
  count: number;
}

export interface TagCloudCardProps {
  allTags?: TagWithCount[];
  selectedTag?: string;
  onTagClick?: (tag: string | null) => void;
  className?: string;
  /**
   * 是否使用默认路由处理
   * @default false
   */
  useDefaultRouting?: boolean;
}

/**
 * 标签云卡片组件
 *
 * 提供两种使用方式：
 * 1. 直接使用并传递onTagClick回调
 * 2. 设置useDefaultRouting=true使用默认路由处理
 */
export function TagCloudCard({
  allTags = [],
  selectedTag,
  onTagClick,
  className,
  useDefaultRouting = false,
}: TagCloudCardProps) {
  const router = useRouter();
  const sortedTags = React.useMemo(() => {
    return [...(allTags || [])].sort((a, b) => b.count - a.count);
  }, [allTags]);

  if (!allTags?.length) return null;

  const handleTagClick = (tagName: string) => {
    if (useDefaultRouting) {
      if (selectedTag === tagName) {
        router.push("/blog");
      } else {
        router.push(`/blog?tag=${encodeURIComponent(tagName)}`);
      }
    } else {
      // 如果点击的是已选中的标签，则取消选中
      if (selectedTag === tagName) {
        onTagClick?.(null);
      } else {
        onTagClick?.(tagName);
      }
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Tag className="h-3.5 w-3.5 text-primary" />
          标签
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="hide-scrollbar max-h-[250px] overflow-y-auto sm:max-h-[300px]">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {sortedTags.map((tag) => {
              const isSelected = selectedTag === tag.name;
              return (
                <Badge
                  key={tag.name}
                  variant={isSelected ? "default" : "secondary"}
                  className={cn(
                    "h-6 min-h-[32px] cursor-pointer touch-manipulation px-2.5 py-1.5 text-xs font-normal transition-all duration-200 sm:h-5 sm:min-h-[20px] sm:px-2 sm:py-0.5 sm:text-[10px]",
                    "hover:scale-105 hover:shadow-sm active:scale-95",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border-0 bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20",
                  )}
                  onClick={() => handleTagClick(tag.name)}
                >
                  {tag.name}
                  <span className="ml-1 opacity-70">({tag.count})</span>
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
