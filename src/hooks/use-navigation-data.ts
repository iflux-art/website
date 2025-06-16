import { useState, useEffect } from 'react';
import { NavigationItem, NavigationCategory } from '@/types/navigation-types';

export const useNavigationData = () => {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [categories, setCategories] = useState<NavigationCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  const loadData = async (categoryId?: string) => {
    const [navigationData, categoriesData] = await Promise.all([
      fetch('/api/navigation').then((res) => res.json()),
      fetch('/api/navigation?type=categories').then((res) => res.json()),
    ]);

    const tagsResponse = await fetch(
      `/api/navigation?type=tags${categoryId ? `&category=${categoryId}` : ''}`
    );
    const tagsData = await tagsResponse.json();

    setItems(navigationData.items || []);
    setCategories(categoriesData || []);
    setAllTags(
      categoryId
        ? tagsData.filter((tag: string) =>
            navigationData.items.some(
              (item: NavigationItem) => item.category === categoryId && item.tags.includes(tag)
            )
          )
        : tagsData || []
    );
  };

  const filteredItems = items.filter((item) => {
    const categoryMatch = !selectedCategory || item.category === selectedCategory;
    const tagMatch = !selectedTag || item.tags.includes(selectedTag);
    return categoryMatch && tagMatch;
  });

  const handleCategoryClick = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTag(null);
    await loadData(categoryId);
  };

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const sortedTags = allTags
    .map((tag) => ({
      name: tag,
      count: items.filter((item) => item.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.count - a.count);

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
