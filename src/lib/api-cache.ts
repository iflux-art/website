/**
 * API 路由缓存工具
 *
 * 用于缓存 API 路由的响应，减少重复请求
 * 现在使用通用缓存工具实现
 */

import { apiCache } from './cache';

/**
 * 获取缓存的 API 响应
 *
 * @param key 缓存键
 * @returns 缓存的响应数据，如果缓存不存在或已过期则返回 null
 */
export function getApiCache<T>(key: string): T | null {
  return apiCache.get<T>(key);
}

/**
 * 设置 API 响应缓存
 *
 * @param key 缓存键
 * @param data 响应数据
 */
export function setApiCache<T>(key: string, data: T): void {
  apiCache.set(key, data);
}

/**
 * 清除 API 缓存
 *
 * @param key 缓存键，如果不提供则清除所有缓存
 */
export function clearApiCache(key?: string): void {
  apiCache.clear(key);
}

/**
 * 生成 API 缓存键
 *
 * @param path API 路径
 * @param params 请求参数
 * @returns 缓存键
 */
export function generateApiCacheKey(path: string, params?: Record<string, unknown>): string {
  return apiCache.generateKey(path, params);
}

/**
 * 带缓存的 API 请求函数
 *
 * @param path API 路径
 * @param params 请求参数
 * @param options 请求选项
 * @returns 响应数据
 */
export async function fetchWithCache<T>(
  path: string,
  params?: Record<string, unknown>,
  options?: RequestInit & { skipCache?: boolean }
): Promise<T> {
  return apiCache.fetch<T>(path, params, options);
}
