/**
 * MDX 缓存工具
 * 
 * 用于缓存 MDX 处理结果，减少重复处理
 */

// 缓存对象
const mdxCache = new Map<string, {
  html: string;
  timestamp: number;
}>();

// 缓存过期时间（毫秒）
const CACHE_EXPIRY = 1000 * 60 * 5; // 5分钟

/**
 * 获取缓存的 MDX 处理结果
 * 
 * @param key 缓存键
 * @returns 缓存的 HTML 字符串，如果缓存不存在或已过期则返回 null
 */
export function getMdxCache(key: string): string | null {
  const cached = mdxCache.get(key);
  
  if (!cached) {
    return null;
  }
  
  // 检查缓存是否过期
  if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
    mdxCache.delete(key);
    return null;
  }
  
  return cached.html;
}

/**
 * 设置 MDX 处理结果缓存
 * 
 * @param key 缓存键
 * @param html 处理后的 HTML 字符串
 */
export function setMdxCache(key: string, html: string): void {
  mdxCache.set(key, {
    html,
    timestamp: Date.now(),
  });
}

/**
 * 清除 MDX 缓存
 * 
 * @param key 缓存键，如果不提供则清除所有缓存
 */
export function clearMdxCache(key?: string): void {
  if (key) {
    mdxCache.delete(key);
  } else {
    mdxCache.clear();
  }
}

/**
 * 生成 MDX 缓存键
 * 
 * @param content MDX 内容
 * @param options 处理选项
 * @returns 缓存键
 */
export function generateMdxCacheKey(content: string, options?: Record<string, any>): string {
  // 使用内容的哈希值作为缓存键
  const contentHash = hashString(content);
  
  // 如果有选项，将选项也包含在缓存键中
  if (options) {
    const optionsHash = hashString(JSON.stringify(options));
    return `${contentHash}-${optionsHash}`;
  }
  
  return contentHash;
}

/**
 * 简单的字符串哈希函数
 * 
 * @param str 要哈希的字符串
 * @returns 哈希值
 */
function hashString(str: string): string {
  let hash = 0;
  
  if (str.length === 0) {
    return hash.toString(16);
  }
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16);
}
