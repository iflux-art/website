/**
 * 文档相关钩子函数
 * @module hooks/use-docs
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { DocCategory, DocItem, DocMeta, DocSidebarItem, DocListItem } from '@/types/docs';

/**
 * 使用文档分类
 *
 * @returns 文档分类列表和加载状态
 */
export function useDocCategories() {
  const [categories, setCategories] = useState<DocCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await fetch('/api/docs/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch document categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * 使用分类文档
 *
 * @param category 分类名称
 * @returns 分类下的文档列表和加载状态
 */
export function useCategoryDocs(category: string) {
  const [docs, setDocs] = useState<DocListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategoryDocs() {
      try {
        setLoading(true);
        console.log(`开始获取分类 ${category} 的文档列表`);

        const response = await fetch(`/api/docs/categories/${encodeURIComponent(category)}`);

        // 即使响应不是 200，也尝试解析响应体
        const data = await response.json();

        if (!response.ok) {
          // 如果响应包含错误信息，使用它
          const errorMessage = data.error || `Failed to fetch documents for category: ${category}`;
          console.error(`获取分类 ${category} 的文档列表失败:`, errorMessage);
          throw new Error(errorMessage);
        }

        console.log(`成功获取分类 ${category} 的文档列表:`, data);
        setDocs(data);
      } catch (err) {
        console.error(`获取分类 ${category} 的文档列表出错:`, err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryDocs();
  }, [category]);

  return { docs, loading, error };
}

/**
 * 使用文档元数据
 *
 * @param category 分类名称
 * @returns 文档元数据和加载状态
 */
export function useDocMeta(category: string) {
  const [meta, setMeta] = useState<DocMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchDocMeta() {
      try {
        setLoading(true);
        console.log(`开始获取分类 ${category} 的元数据`);

        const response = await fetch(`/api/docs/meta/${encodeURIComponent(category)}`);

        // 即使响应不是 200，也尝试解析响应体
        const data = await response.json();

        if (!response.ok) {
          // 如果响应包含错误信息，使用它
          const errorMessage = data.error || `Failed to fetch meta for category: ${category}`;
          console.error(`获取分类 ${category} 的元数据失败:`, errorMessage);
          throw new Error(errorMessage);
        }

        // 检查返回的数据是否为空对象
        if (data && Object.keys(data).length === 0) {
          console.log(`分类 ${category} 没有元数据配置，将使用文件列表`);
          // 不设置错误，因为这是一个有效的情况
        } else {
          console.log(`成功获取分类 ${category} 的元数据:`, data);
        }

        setMeta(data);
      } catch (err) {
        console.error(`获取分类 ${category} 的元数据出错:`, err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchDocMeta();
  }, [category]);

  return { meta, loading, error };
}

// 创建一个全局缓存对象，用于存储侧边栏数据
const sidebarCache: Record<string, { items: DocSidebarItem[], timestamp: number }> = {};
// 缓存过期时间（毫秒）
const CACHE_EXPIRY = 5 * 60 * 1000; // 5分钟

/**
 * 使用文档侧边栏结构
 *
 * @param category 分类名称
 * @returns 侧边栏结构和加载状态
 */
export function useDocSidebar(category: string) {
  const [items, setItems] = useState<DocSidebarItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 使用 useRef 存储上一次的分类，用于比较是否变化
  const prevCategoryRef = useRef<string | null>(null);

  // 使用 useCallback 包装 fetchSidebar 函数，避免在每次渲染时重新创建
  const fetchSidebar = useCallback(async (category: string, force: boolean = false) => {
    // 检查缓存
    const now = Date.now();
    const cachedData = sidebarCache[category];

    // 如果有缓存且未过期且不强制刷新，直接使用缓存
    if (!force && cachedData && (now - cachedData.timestamp < CACHE_EXPIRY)) {
      console.log(`使用缓存的分类 ${category} 的侧边栏结构`);
      setItems(cachedData.items);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`开始获取分类 ${category} 的侧边栏结构`);

      const response = await fetch(`/api/docs/sidebar/${encodeURIComponent(category)}`, {
        // 添加缓存控制头
        headers: {
          'Cache-Control': 'max-age=300', // 5分钟
        }
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || `Failed to fetch sidebar for category: ${category}`;
        console.error(`获取分类 ${category} 的侧边栏结构失败:`, errorMessage);
        throw new Error(errorMessage);
      }

      console.log(`成功获取分类 ${category} 的侧边栏结构:`, data);

      // 更新缓存
      sidebarCache[category] = {
        items: data,
        timestamp: now
      };

      setItems(data);
    } catch (err) {
      console.error(`获取分类 ${category} 的侧边栏结构出错:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error'));

      // 出错时尝试使用旧方法
      try {
        const fallbackResponse = await fetch(`/api/docs/categories/${encodeURIComponent(category)}`);
        const fallbackData = await fallbackResponse.json();

        if (fallbackResponse.ok && Array.isArray(fallbackData) && fallbackData.length > 0) {
          console.log(`使用旧方法获取分类 ${category} 的侧边栏结构`);

          const mappedItems = fallbackData.map(doc => ({
            title: doc.title,
            href: doc.path
          }));

          // 更新缓存
          sidebarCache[category] = {
            items: mappedItems,
            timestamp: now
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

    // 如果缓存中有数据，先使用缓存数据，然后在后台更新
    const cachedData = sidebarCache[category];
    if (cachedData) {
      setItems(cachedData.items);
      setLoading(false);

      // 如果缓存未过期，不在后台更新
      if (Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
        return;
      }

      // 在后台更新缓存
      fetchSidebar(category, true).catch(console.error);
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
  return useMemo(() => ({
    items,
    loading,
    error,
    refetch: () => fetchSidebar(category, true) // 添加刷新方法
  }), [items, loading, error, category, fetchSidebar]);
}

/**
 * 使用文档侧边栏项目（兼容旧版本）
 *
 * @param category 分类名称
 * @param currentDoc 当前文档名称
 * @returns 侧边栏项目列表和加载状态
 * @deprecated 使用 useDocSidebar 代替
 */
export function useDocSidebarItems(category: string, currentDoc?: string) {
  // 使用新的钩子函数
  return useDocSidebar(category);
}
