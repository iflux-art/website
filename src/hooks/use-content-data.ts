'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ContentOptions } from '@/types/hooks';
import { BaseContent, BaseCategory } from '@/types/base';

export type ContentItem = BaseContent;
export type ContentCategory = BaseCategory;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

type ContentCache = Record<string, CacheItem<unknown>>;

// 内存缓存
const contentCache: ContentCache = {};

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
  cacheTime = 5 * 60 * 1000,
  disableCache = false,
  params,
  headers,
}: ContentOptions): {
  data: T | null;
  refresh: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const pathname = usePathname();

  // 生成缓存key
  const getCacheKey = () => {
    return `${type}:${category || 'all'}:${pathname}`;
  };

  // 检查缓存是否有效
  function isValidCache<T>(item: CacheItem<unknown>): item is CacheItem<T> {
    return (
      item &&
      typeof item === 'object' &&
      'data' in item &&
      'timestamp' in item &&
      typeof item.timestamp === 'number' &&
      Date.now() - item.timestamp < cacheTime
    );
  }

  // 从缓存获取数据
  const getFromCache = () => {
    if (disableCache) return null;
    const cacheKey = getCacheKey();
    const cached = contentCache[cacheKey];

    if (cached && isValidCache<T>(cached)) {
      return cached.data;
    }
    return null;
  };

  // 设置缓存
  const setCache = (data: T) => {
    if (!disableCache) {
      const cacheKey = getCacheKey();
      contentCache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // 先尝试从缓存获取
      const cachedData = getFromCache();
      if (cachedData) {
        setData(cachedData as T);
        return;
      }

      try {
        // 构建API URL
        let apiUrl: string;

        if (url) {
          apiUrl = url;
        } else if (path) {
          apiUrl = path.startsWith('/') ? path : `/${path}`;
        } else if (type) {
          apiUrl = `/api/${type}/categories${category ? `/${encodeURIComponent(category)}` : ''}`;
        } else {
          throw new Error('Either url, path or type must be provided');
        }

        // 添加时间戳避免浏览器缓存
        apiUrl += apiUrl.includes('?') ? '&' : '?';
        apiUrl += `t=${Date.now()}`;

        // 添加其他查询参数
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            apiUrl += `&${key}=${encodeURIComponent(value)}`;
          });
        }

        const response = await fetch(apiUrl, {
          headers: headers,
        });
        const result = await response.json();

        if (!response.ok) {
          console.error(`Failed to fetch ${type} data (${response.status})`);
          return;
        }

        if (isMounted) {
          setData(result);
          setCache(result);
        }
      } catch (err) {
        console.error(`Error fetching ${type} data:`, err);
        if (isMounted) {
          setData(null);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [type, path, url, category, pathname, cacheTime, disableCache, params, headers]);

  return { data, refresh: () => setData(null) };
}

// 分类数据获取hook
export function useCategories(type: 'blog' | 'docs') {
  return useContentData<ContentCategory[]>({
    type,
    path: `/api/${type}/categories`,
  });
}

// 分类内容获取hook
export function useCategoryItems(type: 'blog' | 'docs', category: string) {
  return useContentData<ContentItem[]>({
    type,
    path: `/api/${type}/categories/${encodeURIComponent(category)}`,
  });
}
