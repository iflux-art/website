import { useState, useEffect } from 'react';
import { useFilterState } from '@/hooks/use-filter-state';
import { LinksItem, LinksCategory } from '@/types/links-types';

export const useLinksData = () => {
  const [items, setItems] = useState<LinksItem[]>([]);
  const [categories, setCategories] = useState<LinksCategory[]>([]);

  const {
    filteredItems,
    selectedCategory,
    selectedTag,
    handleTagChange: handleTagClick,
    handleCategoryChange,
    filteredTags: sortedTags,
  } = useFilterState(items);

  const loadData = async (_categoryId?: string) => {
    const [linksData, categoriesData] = await Promise.all([
      fetch('/api/links').then((res) => res.json()),
      fetch('/api/links?type=categories').then((res) => res.json()),
    ]);

    setItems(linksData.items || []);
    setCategories(categoriesData || []);
  };

  const handleCategoryClick = async (categoryId: string) => {
    handleCategoryChange(categoryId);
    await loadData(categoryId);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    items,
    categories,
    selectedCategory,
    selectedTag,
    filteredItems,
    sortedTags,
    handleCategoryClick,
    handleTagClick,
    getCategoryName,
  };
};
