"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLinkFilterStore } from "@/stores";
import type { LinksItem } from "@/features/links/types";

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
    // 修改这里，使用resetState代替原来的resetFilters
    resetState,
  } = useLinkFilterStore();

  // 使用useRef存储上一次的items，避免不必要的更新
  const prevItemsRef = useRef<LinksItem[]>([]);

  // 过滤逻辑
  const filteredItems = useMemo(() => {
    let result = [...items]; // 创建一个新数组，避免修改原始数据

    // 按分类过滤
    if (selectedCategory) {
      result = result.filter(item => {
        // 处理子分类的情况，例如 "development/security"
        if (selectedCategory.includes("/")) {
          return item.category === selectedCategory;
        }
        // 处理主分类的情况，需要匹配所有子分类
        return (
          item.category === selectedCategory || item.category.startsWith(`${selectedCategory}/`)
        );
      });
    }

    // 按标签过滤
    if (selectedTag) {
      result = result.filter(item => item.tags?.includes(selectedTag));
    }

    return result;
  }, [items, selectedCategory, selectedTag]); // 依赖整个items数组而不是items.length

  // 更新 Zustand 状态 - 使用useRef避免同步更新导致的无限循环
  useEffect(() => {
    // 检查items是否真的发生了变化
    const hasItemsChanged =
      prevItemsRef.current.length !== items.length ||
      prevItemsRef.current.some((item, index) => item !== items[index]);

    if (hasItemsChanged || filteredItems.length !== prevItemsRef.current.length) {
      prevItemsRef.current = [...items]; // 更新ref
      setFilteredItems(filteredItems);
    }
  }, [filteredItems, items, setFilteredItems]);

  // 标签过滤逻辑
  useEffect(() => {
    // 检查items是否真的发生了变化
    const hasItemsChanged =
      prevItemsRef.current.length !== items.length ||
      prevItemsRef.current.some((item, index) => item !== items[index]);

    if (hasItemsChanged) {
      const tags = new Set<string>();

      items.forEach(item => {
        item.tags?.forEach(tag => {
          tags.add(tag);
        });
      });

      const sortedTags = Array.from(tags).sort();
      setAvailableTags(sortedTags);
    }
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
    // 导出resetState方法
    resetState,
  };
}
