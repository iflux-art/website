"use client";

import { usePathname } from "next/navigation";
import { BaseContent, BaseCategory } from "@/types/data-types";
import { useCache } from "@/hooks/cache";

const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

export type ContentItem = BaseContent;
export type ContentCategory = BaseCategory;

// 内联 HookResult 类型定义
export type HookResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
};

// 内联 ContentLoadOptions 类型定义
export interface ContentLoadOptions {
  type?: string;
  path?: string;
  url?: string;
  category?: string;
  cacheTime?: number;
  disableCache?: boolean;
  params?: any;
  headers?: Record<string, string>;
  /** 是否强制刷新缓存 */
  forceRefresh?: boolean;
  /** 其他可扩展选项 */
  [key: string]: any;
}

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
  cacheTime = DEFAULT_CACHE_TIME,
  disableCache = false,
  params,
  headers,
}: ContentLoadOptions): HookResult<T> {
  const pathname = usePathname();

  // 生成缓存key
  const getCacheKey = () => {
    return `${type}:${category || "all"}:${pathname}`;
  };

  // 数据获取函数
  const fetchData = async () => {
    const apiUrl = url || path || "";
    if (!apiUrl) {
      throw new Error("URL or path is required");
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
            "Content-Type": "application/json",
            ...headers,
          },
          ...(params || {}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result as T;
      } catch {
        throw new Error("Failed to fetch content");
      } finally {
        // 请求完成后移除
        pendingRequests.delete(requestKey);
      }
    })();

    // 存储请求Promise
    pendingRequests.set(requestKey, request);
    return request;
  };

  const { data, error, loading, refetch } = useCache<T>(
    getCacheKey(),
    fetchData,
    {
      expiry: disableCache ? 0 : cacheTime,
      useMemoryCache: true,
    },
  );

  return {
    data: data || null,
    loading,
    error: error || null,
    refresh: async () => {
      await refetch();
    },
  };
}
