import { useMemo } from "react";
import { useSafeFilter } from "@/hooks/use-safe-state";

interface FilterableItem {
  tags?: string[];
  category?: string;
}

export function useFilterState<T extends FilterableItem>(items: T[]) {
  const {
    selectedCategory,
    selectedTag,
    setCategory: setSelectedCategory,
    setTag: setSelectedTag,
    reset,
  } = useSafeFilter();

  // 过滤数据
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      const matchesTag = !selectedTag || item.tags?.includes(selectedTag);
      return matchesCategory && matchesTag;
    });
  }, [items, selectedCategory, selectedTag]);

  // 根据当前选中的分类过滤和统计标签
  const filteredTags = useMemo(() => {
    const currentItems = selectedCategory
      ? items.filter((item) => item.category === selectedCategory)
      : items;

    // 收集当前分类下的所有标签
    const tags = new Map<string, number>();
    currentItems.forEach((item) => {
      item.tags?.forEach((tag) => {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      });
    });

    // 转换为排序后的数组
    return Array.from(tags.entries())
      .map(([tag, count]) => ({
        name: tag,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [items, selectedCategory]);

  // 处理分类切换
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
    setSelectedTag(null); // 清除已选标签
  };

  // 处理标签切换
  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
  };

  return {
    filteredItems,
    selectedCategory,
    selectedTag,
    handleCategoryChange,
    handleTagChange,
    filteredTags,
    reset, // 添加重置功能
  };
}
