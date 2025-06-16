import { useState, useMemo } from 'react';

interface FilterableItem {
  tags?: string[];
  category?: string;
}

export function useFilterState<T extends FilterableItem>(items: T[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 过滤数据
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesTag = !selectedTag || item.tags?.includes(selectedTag);
      return matchesCategory && matchesTag;
    });
  }, [items, selectedCategory, selectedTag]);

  // 处理分类切换
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
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
  };
}
