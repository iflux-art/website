"use client";

import { usePathname } from "next/navigation";
import { useCache } from "@/hooks/use-cache";

// 定义默认缓存时间（30分钟）
const DEFAULT_CACHE_TIME = 30 * 60 * 1000;

// 定义请求选项接口
export interface ContentLoadOptions {
  /** 内容类型 */
  type: string;
  /** 内容路径 */
  path?: string;
  /** 请求 URL */
  url?: string;
  /** 内容分类 */
  category?: string;
  /** 缓存时间（毫秒） */
  cacheTime?: number;
  /** 是否禁用缓存 */
  disableCache?: boolean;
  /** 是否强制刷新 */
  forceRefresh?: boolean;
  /** 请求参数 */
  params?: Record<string, unknown>;
  /** 请求头 */
  headers?: Record<string, string>;
}

// 定义返回结果接口
export interface HookResult<T> {
  /** 数据 */
  data: T | null;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据 */
  refresh: () => Promise<void>;
}

// 存储正在进行的请求，避免重复请求
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * 通用内容数据获取钩子
 *
 * @template T - 返回数据的类型
 * @param options - 配置选项
 * @param options.type - 内容类型
 * @param options.path - 内容路径
 * @param options.url - 请求 URL
 * @param options.category - 内容分类
 * @param options.cacheTime - 缓存时间（毫秒）
 * @param options.disableCache - 是否禁用缓存
 * @param options.params - 请求参数
 * @param options.headers - 请求头
 * @returns 包含数据、加载状态和错误信息的对象
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
  forceRefresh = false, // 新增强制刷新参数
}: ContentLoadOptions): HookResult<T> {
  const pathname = usePathname();

  // 生成缓存key
  const getCacheKey = () => `${type}:${category ?? "all"}:${pathname}`;

  // 数据获取函数
  const fetchData = () => {
    const apiUrl = url ?? path ?? "";
    if (!apiUrl) {
      throw new Error("URL or path is required");
    }

    // 只有在强制刷新时才添加时间戳来防止缓存
    const cacheBuster = forceRefresh ? `?_t=${Date.now()}` : "";
    const finalUrl = `${apiUrl}${cacheBuster}`;

    const requestKey = `${finalUrl}:${JSON.stringify(params)}`;

    // 检查是否有相同请求正在进行
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey) as Promise<T>;
    }

    // 创建请求函数
    const makeRequest = async () => {
      try {
        // 添加缓存控制头来防止服务器缓存
        const headerOptions: Record<string, string> = {
          "Content-Type": "application/json",
          ...(headers ?? {}),
        };

        // 有条件地添加缓存控制头
        if (forceRefresh) {
          headerOptions["Cache-Control"] = "no-cache, no-store, must-revalidate";
          headerOptions.Pragma = "no-cache";
          headerOptions.Expires = "0";
        }

        const fetchOptions: RequestInit = {
          headers: headerOptions,
          cache: forceRefresh || disableCache ? "no-store" : "force-cache",
          next: { revalidate: forceRefresh || disableCache ? 0 : 60 }, // 60秒重新验证
          ...(params ?? {}),
        };

        const response = await fetch(finalUrl, fetchOptions);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: T = (await response.json()) as T;
        return result;
      } catch {
        throw new Error("Failed to fetch content");
      } finally {
        // 请求完成后移除
        pendingRequests.delete(requestKey);
      }
    };

    const request = makeRequest();

    // 存储请求Promise
    pendingRequests.set(requestKey, request);
    return request;
  };

  const { data, error, loading, refetch } = useCache<T>(getCacheKey(), fetchData, {
    expiry: disableCache || forceRefresh ? 0 : cacheTime,
    useMemoryCache: !(forceRefresh || disableCache),
    useLocalStorage: !(forceRefresh || disableCache),
  });

  return {
    data: data ?? null,
    loading,
    error: error ?? null,
    refresh: () => refetch(),
  };
}
