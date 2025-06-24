'use client';

import { usePathname } from 'next/navigation';
import { ContentOptions, BaseContent, BaseCategory } from '@/types';
import { useCache } from './use-cache';
import { CACHE_CONFIG, HookResult } from '../lib/constants';
export type ContentItem = BaseContent;
export type ContentCategory = BaseCategory;

// 请求去重Map
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * 通用内容数据获取钩子
 *
 * @param options 配置选项
 * @returns 数据、加载状态和错误信息
 */
export function useContentData<T>({
  type,
  path,
  url,
  category,
  cacheTime = CACHE_CONFIG.DEFAULT_CACHE_TIME,
  disableCache = false,
  params,
  headers,
}: ContentOptions): HookResult<T> {
  const pathname = usePathname();

  // 生成缓存key
  const getCacheKey = () => {
    return `${type}:${category || 'all'}:${pathname}`;
  };

  // 数据获取函数
  const fetchData = async () => {
    const apiUrl = url || path || '';
    if (!apiUrl) {
      throw new Error('URL or path is required');
    }

    const requestKey = `${apiUrl}:${JSON.stringify(params)}`;

    // 检查是否有相同请求正在进行
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey) as Promise<T>;
    }

    const request = (async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          ...(params || {}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result as T;
      } catch (error) {
        console.error('Error fetching content:', error);
        throw error;
      } finally {
        // 请求完成后移除
        pendingRequests.delete(requestKey);
      }
    })();

    // 存储请求Promise
    pendingRequests.set(requestKey, request);
    return request;
  };

  const { data, error, loading, refetch } = useCache<T>(getCacheKey(), fetchData, {
    expiry: disableCache ? 0 : cacheTime,
    useMemoryCache: true,
  });

  return {
    data: data || null,
    loading,
    error: error || null,
    refresh: async () => {
      await refetch();
    },
  };
}

// 分类数据获取hook
export function useCategories(type: 'blog' | 'docs'): HookResult<ContentCategory[]> {
  return useContentData<ContentCategory[]>({
    type,
    path: `/api/${type}/categories`,
  });
}

// 分类内容获取hook
export function useCategoryItems(
  type: 'blog' | 'docs',
  category: string
): HookResult<ContentItem[]> {
  return useContentData<ContentItem[]>({
    type,
    path: `/api/${type}/categories/${encodeURIComponent(category)}`,
  });
}
