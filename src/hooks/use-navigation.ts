/**
 * 网址导航钩子函数
 * @module hooks/use-navigation
 */

import { useState, useMemo, useEffect } from 'react';
import { Category, Resource } from '@/types/navigation';

/**
 * 获取所有导航分类
 *
 * @returns 导航分类列表和加载状态
 */
export function useNavigationCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/navigation/categories');
        if (!response.ok) {
          throw new Error('获取导航分类失败');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('获取导航分类失败:', err);
        setError('获取导航分类失败');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * 获取精选资源
 *
 * @returns 精选资源列表和加载状态
 */
export function useFeaturedResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch('/api/navigation/featured');
        if (!response.ok) {
          throw new Error('获取精选资源失败');
        }
        const data = await response.json();
        setResources(data);
      } catch (err) {
        console.error('获取精选资源失败:', err);
        setError('获取精选资源失败');
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  return { resources, loading, error };
}

/**
 * 获取最新资源
 *
 * @returns 最新资源列表和加载状态
 */
export function useRecentResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch('/api/navigation/recent');
        if (!response.ok) {
          throw new Error('获取最新资源失败');
        }
        const data = await response.json();
        setResources(data);
      } catch (err) {
        console.error('获取最新资源失败:', err);
        setError('获取最新资源失败');
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  return { resources, loading, error };
}

/**
 * 获取特定分类的资源
 *
 * @param categoryId 分类ID
 * @returns 资源列表和过滤函数
 */
export function useCategoryResources(categoryId: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // 加载资源数据
  useEffect(() => {
    async function fetchResources() {
      try {
        // 使用 API 路由获取分类数据
        const response = await fetch(`/api/navigation/category-data/${categoryId}`);

        if (!response.ok) {
          throw new Error(`获取分类 ${categoryId} 资源失败`);
        }

        const data = await response.json();

        // 将子分类的链接合并为一个资源列表
        const allResources: Resource[] = [];

        if (data.subcategories && Array.isArray(data.subcategories)) {
          data.subcategories.forEach((subcategory: any) => {
            if (subcategory.links && Array.isArray(subcategory.links)) {
              subcategory.links.forEach((link: any) => {
                allResources.push({
                  title: link.title,
                  description: link.description,
                  url: link.url,
                  category: subcategory.title,
                  icon: '🔗', // 默认图标
                  author: '',
                  free: true,
                  tags: link.tags,
                });
              });
            }
          });
        }

        setResources(allResources);
      } catch (err) {
        console.error(`获取分类 ${categoryId} 资源失败:`, err);
        setError(`获取分类 ${categoryId} 资源失败`);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [categoryId]);

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
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await fetch('/api/navigation/categories');

        if (!response.ok) {
          throw new Error('获取导航分类失败');
        }

        const categories = await response.json();
        const foundCategory = categories.find((cat: Category) => cat.id === categoryId);

        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setError(`未找到分类 ${categoryId}`);
        }
      } catch (err) {
        console.error('获取分类详情失败:', err);
        setError('获取分类详情失败');
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [categoryId]);

  return { category, loading, error };
}
