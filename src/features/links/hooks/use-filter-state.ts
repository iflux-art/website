"use client";

import type { LinksItem } from "@/features/links/types";
import { useMemo, useState } from "react";

export function useFilterState(items: LinksItem[]) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const filteredItems = useMemo(() => {
    let result = items;

    // 按分类过滤
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }

    // 按标签过滤
    if (selectedTag) {
      result = result.filter(item => item.tags?.includes(selectedTag));
    }

    return result;
  }, [items, selectedCategory, selectedTag]);

  const filteredTags = useMemo(() => {
    const tags = new Set<string>();

    items.forEach(item => {
      item.tags?.forEach(tag => {
        tags.add(tag);
      });
    });

    return Array.from(tags).sort();
  }, [items]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTag("");
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
  };

  return {
    filteredItems,
    selectedCategory,
    selectedTag,
    handleTagChange,
    handleCategoryChange,
    filteredTags,
  };
}
