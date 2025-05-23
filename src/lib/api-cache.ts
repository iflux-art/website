/**
 * API 路由缓存工具
 * 
 * 用于缓存 API 路由的响应，减少重复请求
 */

// 缓存对象
const apiCache = new Map<string, {
  data: any;
  timestamp: number;
}>();

// 缓存过期时间（毫秒）
const CACHE_EXPIRY = 1000 * 60 * 5; // 5分钟

/**
 * 获取缓存的 API 响应
 * 
 * @param key 缓存键
 * @returns 缓存的响应数据，如果缓存不存在或已过期则返回 null
 */
export function getApiCache<T>(key: string): T | null {
  const cached = apiCache.get(key);
  
  if (!cached) {
    return null;
  }
  
  // 检查缓存是否过期
  if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
    apiCache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

/**
 * 设置 API 响应缓存
 * 
 * @param key 缓存键
 * @param data 响应数据
 */
export function setApiCache<T>(key: string, data: T): void {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * 清除 API 缓存
 * 
 * @param key 缓存键，如果不提供则清除所有缓存
 */
export function clearApiCache(key?: string): void {
  if (key) {
    apiCache.delete(key);
  } else {
    apiCache.clear();
  }
}

/**
 * 生成 API 缓存键
 * 
 * @param path API 路径
 * @param params 请求参数
 * @returns 缓存键
 */
export function generateApiCacheKey(path: string, params?: Record<string, any>): string {
  // 使用路径作为缓存键的基础
  let key = path;
  
  // 如果有参数，将参数也包含在缓存键中
  if (params) {
    // 对参数进行排序，确保相同的参数生成相同的缓存键
    const sortedParams = Object.entries(params)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join('&');
    
    key = `${key}?${sortedParams}`;
  }
  
  return key;
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
  params?: Record<string, any>,
  options?: RequestInit & { skipCache?: boolean }
): Promise<T> {
  // 生成缓存键
  const cacheKey = generateApiCacheKey(path, params);
  
  // 如果没有设置跳过缓存，尝试从缓存中获取响应
  if (!options?.skipCache) {
    const cachedData = getApiCache<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }
  
  // 构建 URL
  let url = path;
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }
  }
  
  // 发送请求
  const response = await fetch(url, options);
  
  // 检查响应状态
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  // 解析响应数据
  const data = await response.json() as T;
  
  // 如果没有设置跳过缓存，将响应数据存入缓存
  if (!options?.skipCache) {
    setApiCache(cacheKey, data);
  }
  
  return data;
}
