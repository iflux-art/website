/**
 * 文档相关钩子函数
 * @module hooks/use-docs
 */

'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { SidebarItem } from '@/components/layout/sidebar';
import { docsSidebarCache } from '@/lib/local-storage-cache';
import { useContentData } from '@/hooks/use-content-data';
import { DocItem, DocCategory, DocMeta, DocListItem } from '@/components/features/docs/docs-types';

/**
 * 使用文档分类
 *
 * @returns 文档分类列表和加载状态
 */
export function useDocCategories() {
  const {
    data: categories = [],
    error,
    loading,
  } = useContentData<DocCategory[]>({
    type: 'docs',
    path: '/api/docs/categories',
    errorMessage: 'Failed to fetch doc categories',
  });
  return { categories, loading, error };
}

/**
 * 使用分类文档
 *
 * @param category 分类名称
 * @returns 分类下的文档列表和加载状态
 */
export function useCategoryDocs(category: string) {
  const {
    data: docs = [],
    error,
    loading,
  } = useContentData<DocListItem[]>({
    type: 'docs',
    path: `/api/docs/categories/${encodeURIComponent(category)}`,
    errorMessage: `Failed to fetch docs for category: ${category}`,
  });
  return { docs, loading, error };
}

/**
 * 使用文档元数据
 *
 * @param category 分类名称
 * @returns 文档元数据和加载状态
 */
export function useDocMeta(category: string) {
  const {
    data: meta = null,
    error,
    loading,
  } = useContentData<DocMeta>({
    type: 'docs',
    path: `/api/docs/meta/${encodeURIComponent(category)}`,
    errorMessage: `Failed to fetch meta for category: ${category}`,
  });
  return { meta, loading, error };
}

// 创建一个全局内存缓存对象，用于存储侧边栏数据
const sidebarMemoryCache: Record<string, { items: SidebarItem[]; timestamp: number }> = {};
// 缓存过期时间（毫秒）
const CACHE_EXPIRY = 30 * 60 * 1000; // 30分钟

/**
 * 使用文档侧边栏结构
 *
 * @param category 分类名称
 * @returns 侧边栏结构和加载状态
 */
export function useDocSidebar(category: string) {
  const [items, setItems] = useState<SidebarItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 使用 useRef 存储上一次的分类，用于比较是否变化
  const prevCategoryRef = useRef<string | null>(null);

  // 使用 useCallback 包装 fetchSidebar 函数，避免在每次渲染时重新创建
  const fetchSidebar = useCallback(async (category: string, force: boolean = false) => {
    // 检查内存缓存
    const now = Date.now();
    const cachedData = sidebarMemoryCache[category];

    // 如果有内存缓存且未过期且不强制刷新，直接使用缓存
    if (!force && cachedData && now - cachedData.timestamp < CACHE_EXPIRY) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`使用内存缓存的分类 ${category} 的侧边栏结构`);
      }
      setItems(cachedData.items);
      setLoading(false);
      return;
    }

    // 尝试从 localStorage 获取缓存
    if (!force) {
      const lsCachedData = docsSidebarCache.get<SidebarItem[]>(category);

      if (lsCachedData) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`使用 localStorage 缓存的分类 ${category} 的侧边栏结构`);
        }

        // 更新内存缓存
        sidebarMemoryCache[category] = {
          items: lsCachedData,
          timestamp: now,
        };

        setItems(lsCachedData);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      if (process.env.NODE_ENV === 'development') {
        console.log(`开始获取分类 ${category} 的侧边栏结构`);
      }

      const response = await fetch(`/api/docs/sidebar/${encodeURIComponent(category)}`, {
        // 添加缓存控制头
        headers: {
          'Cache-Control': 'max-age=1800', // 30分钟
          Pragma: 'no-cache', // 确保不使用过期缓存
        },
        // 添加时间戳避免浏览器缓存
        cache: 'no-store',
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || `Failed to fetch sidebar for category: ${category}`;
        console.error(`获取分类 ${category} 的侧边栏结构失败:`, errorMessage);
        throw new Error(errorMessage);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`成功获取分类 ${category} 的侧边栏结构`);
      }

      // 更新内存缓存
      sidebarMemoryCache[category] = {
        items: data,
        timestamp: now,
      };

      // 更新 localStorage 缓存
      docsSidebarCache.set(category, data);

      if (process.env.NODE_ENV === 'development') {
        console.log(`已将分类 ${category} 的侧边栏结构保存到缓存`);
      }

      setItems(data);
    } catch (err) {
      console.error(`获取分类 ${category} 的侧边栏结构出错:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error'));

      // 出错时尝试使用旧方法
      try {
        const fallbackResponse = await fetch(
          `/api/docs/categories/${encodeURIComponent(category)}`
        );
        const fallbackData = await fallbackResponse.json();

        if (fallbackResponse.ok && Array.isArray(fallbackData) && fallbackData.length > 0) {
          console.log(`使用旧方法获取分类 ${category} 的侧边栏结构`);

          const mappedItems = fallbackData.map(doc => ({
            title: doc.title,
            href: doc.path,
          }));

          // 更新缓存
          sidebarMemoryCache[category] = {
            items: mappedItems,
            timestamp: now,
          };

          // 使用函数形式的 setState，避免闭包问题
          setItems(mappedItems);
          // 清除错误，因为我们成功降级了
          setError(null);
        }
      } catch (fallbackErr) {
        console.error(`降级获取分类 ${category} 的侧边栏结构也失败:`, fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 使用 useEffect 调用 fetchSidebar
  useEffect(() => {
    // 只有当分类变化时才重新获取数据
    const categoryChanged = prevCategoryRef.current !== category;
    prevCategoryRef.current = category;

    // 如果分类没有变化，且已经有数据，不重新获取
    if (!categoryChanged && items.length > 0) {
      // 即使不重新获取，也设置 loading 为 false，确保 UI 不显示加载状态
      setLoading(false);
      return;
    }

    // 如果缓存中有数据，先使用缓存数据
    const cachedData = sidebarMemoryCache[category];
    if (cachedData) {
      setItems(cachedData.items);
      setLoading(false);

      // 如果缓存未过期，不在后台更新
      if (Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
        return;
      }

      // 延迟在后台更新缓存，避免影响页面渲染
      const timer = setTimeout(() => {
        fetchSidebar(category, true).catch(console.error);
      }, 1000); // 延迟1秒后更新

      return () => clearTimeout(timer);
    } else {
      // 没有缓存，正常获取数据
      fetchSidebar(category);
    }

    // 返回清理函数
    return () => {
      // 在组件卸载或分类变化时，可以在这里执行清理操作
    };
  }, [category, fetchSidebar, items.length]);

  // 使用 useMemo 返回结果，避免在每次渲染时创建新对象
  return useMemo(
    () => ({
      items,
      loading,
      error,
      refetch: () => fetchSidebar(category, true), // 添加刷新方法
    }),
    [items, loading, error, category, fetchSidebar]
  );
}

/**
 * 获取所有文档
 * @returns 所有文档列表
 */
export async function getAllDocs(): Promise<DocItem[]> {
  const response = await fetch('/api/docs/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('获取文档失败');
  }

  const docs: DocItem[] = await response.json();
  return docs;
}

/**
 * 使用文档侧边栏项目（兼容旧版本）
 *
 * @param category 分类名称
 * @param currentDoc 当前文档名称
 * @returns 侧边栏项目列表和加载状态
 * @deprecated 使用 useDocSidebar 代替
 */
export function useDocSidebarItems(category: string, _currentDoc?: string) {
  // 使用新的钩子函数
  return useDocSidebar(category);
}
