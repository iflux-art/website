/**
 * 网址导航钩子函数
 * @module hooks/use-navigation
 */

import { useState, useMemo } from 'react';
import { Category, Resource } from '@/types/navigation';
import { navigationCategories } from '@/data/navigation/categories';
import { getFeaturedResources, getRecentResources } from '@/data/navigation/featured';
import { aiResources } from '@/data/navigation/ai';
import { designResources } from '@/data/navigation/design';
import { developmentResources } from '@/data/navigation/development';
import { productivityResources } from '@/data/navigation/productivity';

/**
 * 获取所有导航分类
 * 
 * @returns 导航分类列表
 */
export function useNavigationCategories(): Category[] {
  return navigationCategories;
}

/**
 * 获取精选资源
 * 
 * @returns 精选资源列表
 */
export function useFeaturedResources(): Resource[] {
  return getFeaturedResources();
}

/**
 * 获取最新资源
 * 
 * @returns 最新资源列表
 */
export function useRecentResources(): Resource[] {
  return getRecentResources();
}

/**
 * 获取特定分类的资源
 * 
 * @param categoryId 分类ID
 * @returns 资源列表和过滤函数
 */
export function useCategoryResources(categoryId: string) {
  // 根据分类ID获取对应的资源
  const resources = useMemo(() => {
    switch (categoryId) {
      case 'ai':
        return aiResources;
      case 'design':
        return designResources;
      case 'development':
        return developmentResources;
      case 'productivity':
        return productivityResources;
      default:
        return [];
    }
  }, [categoryId]);
  
  // 获取所有分类
  const categories = useMemo(() => {
    return [...new Set(resources.map(resource => resource.category))];
  }, [resources]);
  
  // 分类过滤状态
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // 根据选中的分类筛选资源
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
    filteredResources
  };
}

/**
 * 获取分类详情
 * 
 * @param categoryId 分类ID
 * @returns 分类详情
 */
export function useCategoryDetails(categoryId: string): Category | undefined {
  return navigationCategories.find(category => category.id === categoryId);
}
