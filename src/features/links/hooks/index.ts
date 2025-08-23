'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCategories } from './use-categories';
import { useFilterState } from './use-filter-state';
import type { LinksItem } from '@/features/links/types';
import { loadAllLinksData } from '@/features/links/lib';

export function useLinksData() {
  const [items, setItems] = useState<LinksItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 使用共享的分类数据 hook
  const { getCategoryName: getCategoryNameFromHook, getFilteredCategories } = useCategories();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const itemsData = await loadAllLinksData();
        setItems(itemsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, []);

  // 过滤掉友链和个人主页分类的数据 - 性能优化使用 useMemo
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category !== 'friends' && item.category !== 'profile');
  }, [items]);

  // 使用共享的分类过滤函数
  const filteredCategories = useMemo(() => {
    return getFilteredCategories();
  }, [getFilteredCategories]);

  // 使用过滤后的数据进行状态管理
  const {
    filteredItems: categoryFilteredItems,
    selectedCategory,
    selectedTag,
    handleTagChange: handleTagClick,
    handleCategoryChange,
    filteredTags: sortedTags,
  } = useFilterState(filteredItems);

  const handleCategoryClick = (categoryId: string) => {
    handleCategoryChange(categoryId);
  };

  // 使用共享的分类名称获取函数
  const getCategoryName = getCategoryNameFromHook;

  // 计算总数 - 使用 useMemo 缓存计算结果
  const totalFilteredCount = useMemo(() => {
    return filteredItems.length;
  }, [filteredItems]);

  return {
    items: filteredItems, // 返回过滤后的数据（用于链接导航页面）
    allItems: items, // 返回所有原始数据（用于友链和关于页面）
    categories: filteredCategories, // 返回过滤后的分类
    selectedCategory,
    selectedTag,
    filteredItems: categoryFilteredItems, // 经过分类筛选的数据
    sortedTags,
    totalFilteredCount,
    loading,
    error,
    handleCategoryClick,
    handleTagClick,
    getCategoryName,
  };
}
