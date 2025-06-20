import { LRUCache } from 'lru-cache';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  type: string;
  score?: number;
}

// 搜索结果缓存
const searchCache = new LRUCache<string, SearchResult[]>({
  max: 500, // 最多缓存500个搜索结果
  ttl: 1000 * 60 * 5, // 缓存5分钟
});

/**
 * 生成搜索缓存键
 */
export function getSearchCacheKey(query: string, limit: number): string {
  return `search:${query}:${limit}`;
}

/**
 * 获取缓存的搜索结果
 */
export function getCachedSearchResults(query: string, limit: number) {
  return searchCache.get(getSearchCacheKey(query, limit));
}

/**
 * 缓存搜索结果
 */
export function cacheSearchResults(query: string, limit: number, results: SearchResult[]) {
  searchCache.set(getSearchCacheKey(query, limit), results);
}

/**
 * 清除特定搜索的缓存
 */
export function clearSearchCache(query?: string, limit?: number) {
  if (query && limit) {
    searchCache.delete(getSearchCacheKey(query, limit));
  } else {
    searchCache.clear();
  }
}
