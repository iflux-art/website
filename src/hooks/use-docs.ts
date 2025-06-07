/**
 * 文档相关钩子函数
 * @module hooks/use-docs
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarItem } from '@/components/ui/sidebar';
import { docsSidebarCache } from '@/lib/local-storage-cache';

/**
 * 文档分类
 */
export interface DocCategory {
  /**
   * 分类唯一标识
   */
  id: string;

  /**
   * 分类标题
   */
  title: string;

  /**
   * 分类描述
   */
  description: string;

  /**
   * 分类下的文档数量
   */
  count: number;
}

/**
 * 文档项
 */
export interface DocItem {
  /**
   * 文档唯一标识（URL 路径）
   */
  slug: string;

  /**
   * 所属分类
   */
  category: string;

  /**
   * 文档标题
   */
  title: string;

  /**
   * 文档描述
   */
  description: string;

  /**
   * 发布日期
   */
  date?: string;
}

/**
 * 文档元数据
 */
export interface DocMeta {
  /**
   * 分类名称作为键，分类元数据作为值
   */
  [key: string]: string | unknown;
}

/**
 * 文档列表项（用于侧边栏）
 */
export interface DocListItem {
  /**
   * 文档唯一标识
   */
  slug: string;

  /**
   * 文档标题
   */
  title: string;

  /**
   * 文档路径
   */
  path: string;
}

/**
 * 使用文档分类
 *
 * @returns 文档分类列表和加载状态
 */
export function useDocCategories() {
  const pathname = usePathname(); // 获取当前路径
  const [categories, setCategories] = useState<DocCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [dataFetched, setDataFetched] = useState(false); // 标记数据是否已获取

  useEffect(() => {
    async function fetchCategories() {
      // 如果已经在加载中，则不重复加载
      if (loading && dataFetched) return;

      setLoading(true);
      try {
        console.log('获取文档分类列表中...', pathname);
        // 添加时间戳避免缓存
        const response = await fetch('/api/docs/categories?t=' + Date.now());
        if (!response.ok) {
          throw new Error('Failed to fetch document categories');
        }
        const data = await response.json();
        console.log('文档分类获取成功', data.length);
        setCategories(data);
        setDataFetched(true); // 标记数据已获取
      } catch (err) {
        console.error('获取文档分类失败:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [pathname]); // 添加pathname作为依赖，当路径变化时重新获取数据

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