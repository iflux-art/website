/**
 * MDX 缓存工具
 *
 * 用于缓存 MDX 处理结果，提高页面加载速度
 * 现在使用通用缓存工具实现
 */

import { mdxCache } from './cache';

/**
 * 获取缓存的 MDX 处理结果
 *
 * @param key 缓存键
 * @returns 缓存的 HTML 字符串，如果缓存不存在或已过期则返回 null
 */
export function getMdxCache(key: string): string | null {
  return mdxCache.get<string>(key);
}

/**
 * 设置 MDX 处理结果缓存
 *
 * @param key 缓存键
 * @param html 处理后的 HTML 字符串
 */
export function setMdxCache(key: string, html: string): void {
  mdxCache.set(key, html);
}

/**
 * 清除 MDX 缓存
 *
 * @param key 缓存键，如果不提供则清除所有缓存
 */
export function clearMdxCache(key?: string): void {
  mdxCache.clear(key);
}

/**
 * 生成 MDX 缓存键
 *
 * @param content MDX 内容
 * @param options 处理选项
 * @returns 缓存键
 */
export function generateMdxCacheKey(content: string, options?: Record<string, unknown>): string {
  return mdxCache.generateKey(content, options);
}