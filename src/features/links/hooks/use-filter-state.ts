"use client";

import type { LinksItem } from "@/features/links/types";
import { useEffect, useMemo } from "react";
import { useLinkFilterStore } from "@/stores";

// 保持兼容性，逐步迁移
export function useFilterState(items: LinksItem[]) {
  const {
    selectedCategory,
    selectedTag,
    availableTags,
    setSelectedCategory,
    setSelectedTag,
    setFilteredItems,
    setAvailableTags,
  } = useLinkFilterStore();

  // 过滤逻辑
  const filteredItems = useMemo(() => {
    let result = [...items]; // 创建一个新数组，避免修改原始数据

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

  // 更新 Zustand 状态
  useEffect(() => {
    setFilteredItems(filteredItems);
  }, [filteredItems, setFilteredItems]);

  // 标签过滤逻辑
  useEffect(() => {
    const tags = new Set<string>();

    items.forEach(item => {
      item.tags?.forEach(tag => {
        tags.add(tag);
      });
    });

    const sortedTags = Array.from(tags).sort();
    setAvailableTags(sortedTags);
  }, [items, setAvailableTags]);

  const handleCategoryChange = (categoryId: string) => {
    // 如果点击当前选中的分类，则取消选择
    if (categoryId === selectedCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(categoryId);
    }
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
    filteredTags: availableTags,
  };
}
