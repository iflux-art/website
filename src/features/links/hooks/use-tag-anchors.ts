"use client";

import type { LinksItem } from "@/features/links/types";
import { useMemo } from "react";

export interface TagAnchor {
  id: string;
  text: string;
  level: number;
}

/**
 * 从链接数据中提取唯一标签并生成锚点数据
 * @param items 链接数据数组
 * @returns 标签锚点数组，按标签名称排序
 */
export function useTagAnchors(items: LinksItem[]): TagAnchor[] {
  return useMemo(() => {
    // 提取所有标签并去重
    const uniqueTags = new Set<string>();

    items.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          if (tag && typeof tag === "string" && tag.trim()) {
            uniqueTags.add(tag.trim());
          }
        });
      }
    });

    // 转换为标签锚点数组并排序
    const tagAnchors: TagAnchor[] = Array.from(uniqueTags)
      .sort((a, b) => a.localeCompare(b, "zh-CN", { numeric: true }))
      .map(tag => ({
        id: `tag-${tag.replace(/\s+/g, "-").toLowerCase()}`,
        text: tag,
        level: 2,
      }));

    return tagAnchors;
  }, [items]);
}
