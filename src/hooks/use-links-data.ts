import { useState } from 'react';
import { useFilterState } from '@/components/common/filter/use-filter-state';
import { Item, Category } from '@/types/links';
import itemsData from '@/data/links/items.json';
import categoriesData from '@/data/links/categories.json';

export const useLinksData = () => {
  const [items] = useState<Item[]>(itemsData as Item[]);
  const [categories] = useState<Category[]>(
    (categoriesData as Category[]).sort((a, b) => a.order - b.order)
  );

  const {
    filteredItems,
    selectedCategory,
    selectedTag,
    handleTagChange: handleTagClick,
    handleCategoryChange,
    filteredTags: sortedTags,
  } = useFilterState(items);

  const handleCategoryClick = (categoryId: string) => {
    handleCategoryChange(categoryId);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

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
