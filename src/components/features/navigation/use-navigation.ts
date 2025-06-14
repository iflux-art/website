/**
 * 网址导航钩子函数
 * @module hooks/use-navigation
 */

'use client';

import { useState, useMemo } from 'react';
import {
  NavigationCategory,
  NavigationItem as Resource,
  Subcategory,
  Link,
} from '@/components/features/navigation/navigation-types';
import { useContentData } from '@/hooks/use-content-data';

/**
 * 获取所有导航分类
 *
 * @returns 导航分类列表和加载状态
 */
export function useNavigationCategories() {
  const {
    data: categories,
    loading,
    error,
  } = useContentData<NavigationCategory[]>({
    type: 'blog',
    path: '/api/navigation/categories',
    errorMessage: '获取导航分类失败',
  });

  return { categories: categories || [], loading, error };
}

/**
 * 获取精选资源
 *
 * @returns 精选资源列表和加载状态
 */
export function useFeaturedResources() {
  const {
    data: resources,
    loading,
    error,
  } = useContentData<Resource[]>({
    type: 'blog',
    path: '/api/navigation/featured',
    errorMessage: '获取精选资源失败',
  });

  return { resources: resources || [], loading, error };
}

/**
 * 获取最新资源
 *
 * @returns 最新资源列表和加载状态
 */
export function useRecentResources() {
  const {
    data: resources,
    loading,
    error,
  } = useContentData<Resource[]>({
    type: 'blog',
    path: '/api/navigation/recent',
    errorMessage: '获取最新资源失败',
  });

  return { resources: resources || [], loading, error };
}

/**
 * 获取特定分类的资源
 *
 * @param categoryId 分类ID
 * @returns 资源列表和过滤函数
 */
export function useCategoryResources(categoryId: string) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, loading, error } = useContentData<{ subcategories: Subcategory[] }>({
    type: 'blog',
    path: `/api/navigation/category-data/${categoryId}`,
    errorMessage: `获取分类 ${categoryId} 资源失败`,
  });

  const resources = useMemo(() => {
    if (!data?.subcategories) return [];

    const allResources: Resource[] = [];
    data.subcategories.forEach((subcategory: Subcategory) => {
      if (subcategory.links && Array.isArray(subcategory.links)) {
        subcategory.links.forEach((link: Link) => {
          allResources.push({
            id: link.url.replace(/[^\w\s]/g, '-').toLowerCase(),
            title: link.title,
            description: link.description,
            url: link.url,
            category: subcategory.title,
            icon: '🔗',
            tags: link.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        });
      }
    });
    return allResources;
  }, [data]);

  const categories = useMemo(() => {
    return [...new Set(resources.map(resource => resource.category))];
  }, [resources]);

  const filteredResources = useMemo(() => {
    return selectedCategory
      ? resources.filter(resource => resource.category === selectedCategory)
      : resources;
  }, [resources, selectedCategory]);

  return {
    resources,
    categories,
    selectedCategory,
    setSelectedCategory,
    filteredResources,
    loading,
    error,
  };
}

/**
 * 获取分类详情
 *
 * @param categoryId 分类ID
 * @returns 分类详情
 */
export function useCategoryDetails(categoryId: string) {
  const {
    data: categories,
    loading,
    error: fetchError,
  } = useContentData<NavigationCategory[]>({
    type: 'blog',
    path: '/api/navigation/categories',
    errorMessage: '获取分类详情失败',
  });

  const category = useMemo(
    () => categories?.find(cat => cat.id === categoryId) || null,
    [categories, categoryId]
  );

  const error = fetchError || (!category && categories ? `未找到分类 ${categoryId}` : null);

  return { category, loading, error };
}

/**
 * 获取导航数据
 * @returns 导航数据，包含分类和工具列表
 */
/**
 * 获取导航数据
 * @returns 导航数据，包含分类和工具列表
 */
export async function getNavigationData() {
  const response = await fetch('http://localhost:3000/api/navigation');
  if (!response.ok) {
    throw new Error('Failed to fetch navigation data');
  }
  const data = await response.json();
  return data as {
    categories: NavigationCategory[];
    tools: Array<{
      id: string;
      title: string;
      description: string;
      category: string;
    }>;
  };
}
