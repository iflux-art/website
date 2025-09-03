"use client";

import { LinkCard } from "@/features/links/components/link-card";
import type { LinksItem } from "@/features/links/types";
import { cn } from "@/utils";
import { useMemo } from "react";

export interface LinksContentProps {
  items: LinksItem[];
  selectedCategory?: string;
  className?: string;
}

/**
 * 链接内容组件
 *
 * 显示按标签分组的链接卡片
 * 为每个标签分组生成 h2 标题和锚点
 */
export const LinksContent = ({ items, selectedCategory, className }: LinksContentProps) => {
  // 按标签对链接进行分组
  const groupedItems = useMemo(() => {
    // 创建标签到链接的映射
    const tagMap = new Map<string, LinksItem[]>();

    items.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          if (tag && typeof tag === "string" && tag.trim()) {
            const trimmedTag = tag.trim();
            if (!tagMap.has(trimmedTag)) {
              tagMap.set(trimmedTag, []);
            }
            tagMap.get(trimmedTag)?.push(item);
          }
        });
      }
    });

    // 转换为数组并排序
    const sortedGroups = Array.from(tagMap.entries())
      .sort(([a], [b]) => a.localeCompare(b, "zh-CN", { numeric: true }))
      .map(([tag, tagItems]) => ({
        tag,
        items: tagItems,
      }));

    return sortedGroups;
  }, [items]);

  // 生成锚点 ID
  if (!items || items.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="text-center">
          <h3 className="mb-2 text-lg font-medium text-muted-foreground">暂无链接</h3>
          <p className="text-sm text-muted-foreground">
            {selectedCategory ? "当前分类下没有链接" : "没有找到任何链接"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {groupedItems.map(({ tag, items: tagItems }) => {
        // 生成与 use-tag-anchors 钩子一致的锚点 ID
        const anchorId = `tag-${tag.replace(/\s+/g, "-").toLowerCase()}`;

        return (
          <section key={tag} className="space-y-4">
            {/* 标签标题，用于锚点跳转 */}
            <h2
              id={anchorId}
              className="scroll-mt-24 border-b border-border pb-2 text-xl font-semibold text-foreground"
            >
              {tag}
            </h2>

            {/* 链接卡片网格 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {tagItems.map(item => (
                <LinkCard
                  key={item.id}
                  title={item.title}
                  description={item.description || item.url}
                  href={item.url}
                  icon={item.icon}
                  iconType={item.iconType}
                  isExternal
                  className="h-full"
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
