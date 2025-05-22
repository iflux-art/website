'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Category, Resource } from '@/types/navigation';

/**
 * 统一的导航数据加载hook
 *
 * 使用Promise.all并行加载所有导航相关数据，减少多个独立loading状态
 *
 * @returns 包含所有导航数据和统一加载状态的对象
 */
export function useNavigationData() {
  const pathname = usePathname(); // 获取当前路径
  const [data, setData] = useState<{
    categories: Category[];
    featuredResources: Resource[];
    recentResources: Resource[];
  }>({
    categories: [],
    featuredResources: [],
    recentResources: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState(false); // 标记数据是否已获取

  useEffect(() => {
    // 如果路径变化或者数据尚未获取，则获取数据
    async function fetchAllData() {
      // 如果已经在加载中，则不重复加载
      if (loading && dataFetched) return;

      setLoading(true);
      try {
        console.log('获取导航数据中...', pathname);
        // 使用Promise.all并行请求所有数据，添加时间戳避免缓存
        const [categoriesRes, featuredRes, recentRes] = await Promise.all([
          fetch('/api/navigation/categories?t=' + Date.now()),
          fetch('/api/navigation/featured?t=' + Date.now()),
          fetch('/api/navigation/recent?t=' + Date.now()),
        ]);

        // 检查响应状态
        if (!categoriesRes.ok || !featuredRes.ok || !recentRes.ok) {
          throw new Error('获取导航数据失败');
        }

        // 解析数据
        const categories = await categoriesRes.json();
        const featuredResources = await featuredRes.json();
        const recentResources = await recentRes.json();

        console.log(
          '导航数据获取成功',
          categories.length,
          featuredResources.length,
          recentResources.length
        );

        // 设置所有数据
        setData({
          categories,
          featuredResources,
          recentResources,
        });
        setDataFetched(true); // 标记数据已获取
      } catch (err) {
        console.error('获取导航数据失败:', err);
        setError('获取导航数据失败');
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [pathname]); // 添加pathname作为依赖，当路径变化时重新获取数据

  return {
    categories: data.categories,
    featuredResources: data.featuredResources,
    recentResources: data.recentResources,
    loading,
    error,
  };
}

/**
 * 获取特定分类的详细数据
 *
 * @param categoryId 分类ID
 * @returns 分类详情、子分类和加载状态
 */
export function useCategoryDetail(categoryId: string) {
  const pathname = usePathname(); // 获取当前路径
  const [data, setData] = useState<{
    category: Category | null;
    subcategories: any[];
  }>({
    category: null,
    subcategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState(false); // 标记数据是否已获取

  useEffect(() => {
    async function fetchCategoryData() {
      // 如果已经在加载中，则不重复加载
      if (loading && dataFetched) return;

      setLoading(true);
      try {
        console.log('获取分类数据中...', categoryId, pathname);
        // 使用 API 获取分类数据，添加时间戳避免缓存
        const response = await fetch(`/api/navigation/category-data/${categoryId}?t=${Date.now()}`);

        if (!response.ok) {
          throw new Error(`获取分类数据失败: ${response.status}`);
        }

        const result = await response.json();
        console.log('分类数据获取成功', result);

        setData({
          category: result.category,
          subcategories: result.subcategories || [],
        });
        setDataFetched(true); // 标记数据已获取
      } catch (err) {
        console.error('获取分类数据失败:', err);
        setError('无法加载该分类数据');
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryData();
  }, [categoryId, pathname]); // 添加pathname作为依赖，当路径变化时重新获取数据

  return {
    category: data.category,
    subcategories: data.subcategories,
    loading,
    error,
  };
}
