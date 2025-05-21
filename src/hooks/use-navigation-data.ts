"use client";

import { useState, useEffect } from "react";
import { Category, Resource } from "@/types/navigation";

/**
 * 统一的导航数据加载hook
 *
 * 使用Promise.all并行加载所有导航相关数据，减少多个独立loading状态
 *
 * @returns 包含所有导航数据和统一加载状态的对象
 */
export function useNavigationData() {
  const [data, setData] = useState<{
    categories: Category[];
    featuredResources: Resource[];
    recentResources: Resource[];
  }>({
    categories: [],
    featuredResources: [],
    recentResources: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      try {
        // 使用Promise.all并行请求所有数据
        const [categoriesRes, featuredRes, recentRes] = await Promise.all([
          fetch('/api/navigation/categories'),
          fetch('/api/navigation/featured'),
          fetch('/api/navigation/recent')
        ]);

        // 检查响应状态
        if (!categoriesRes.ok || !featuredRes.ok || !recentRes.ok) {
          throw new Error('获取导航数据失败');
        }

        // 解析数据
        const categories = await categoriesRes.json();
        const featuredResources = await featuredRes.json();
        const recentResources = await recentRes.json();

        // 设置所有数据
        setData({
          categories,
          featuredResources,
          recentResources
        });
      } catch (err) {
        console.error('获取导航数据失败:', err);
        setError('获取导航数据失败');
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  return {
    categories: data.categories,
    featuredResources: data.featuredResources,
    recentResources: data.recentResources,
    loading,
    error
  };
}

/**
 * 获取特定分类的详细数据
 *
 * @param categoryId 分类ID
 * @returns 分类详情、子分类和加载状态
 */
export function useCategoryDetail(categoryId: string) {
  const [data, setData] = useState<{
    category: Category | null;
    subcategories: any[];
  }>({
    category: null,
    subcategories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategoryData() {
      setLoading(true);
      try {
        // 使用 API 获取分类数据
        const response = await fetch(`/api/navigation/category-data/${categoryId}`);

        if (!response.ok) {
          throw new Error(`获取分类数据失败: ${response.status}`);
        }

        const result = await response.json();

        setData({
          category: result.category,
          subcategories: result.subcategories || []
        });
      } catch (err) {
        console.error('获取分类数据失败:', err);
        setError('无法加载该分类数据');
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryData();
  }, [categoryId]);

  return {
    category: data.category,
    subcategories: data.subcategories,
    loading,
    error
  };
}
