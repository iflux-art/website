import { useState, useEffect } from 'react';
import { LinksItem, LinksCategory } from '@/types/links-types';

export const useLinksData = () => {
  const [items, setItems] = useState<LinksItem[]>([]);
  const [categories, setCategories] = useState<LinksCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  const loadData = async (categoryId?: string) => {
    const [linksData, categoriesData] = await Promise.all([
      fetch('/api/links').then((res) => res.json()),
      fetch('/api/links?type=categories').then((res) => res.json()),
    ]);

    const tagsResponse = await fetch(
      `/api/links?type=tags${categoryId ? `&category=${categoryId}` : ''}`
    );
    const tagsData = await tagsResponse.json();

    setItems(linksData.items || []);
    setCategories(categoriesData || []);
    setAllTags(
      categoryId
        ? tagsData.filter((tag: string) =>
            linksData.items.some(
              (item: LinksItem) => item.category === categoryId && item.tags.includes(tag)
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
