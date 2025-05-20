"use client";

import { useState, useCallback, useEffect } from 'react';
import { SearchResult, UseSearchReturn } from '@/types/search';

/**
 * 搜索钩子
 * 用于执行搜索并管理搜索状态
 *
 * @returns {UseSearchReturn} 搜索状态和方法
 */
export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCache, setSearchCache] = useState<Record<string, SearchResult[]>>({});
  const [lastQuery, setLastQuery] = useState<string>('');

  // 清除搜索结果
  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  // 执行搜索
  const search = useCallback(async (query: string, category?: string) => {
    // 添加调试日志
    console.log('执行搜索:', query, category);

    // 如果查询为空，清除结果
    if (!query.trim()) {
      console.log('查询为空，清除结果');
      clearResults();
      return;
    }

    // 如果与上次查询相同，不重复搜索
    const cacheKey = `${query}:${category || ''}`;
    if (cacheKey === lastQuery) {
      console.log('查询与上次相同，跳过搜索');
      return;
    }

    setLastQuery(cacheKey);

    // 检查缓存
    if (searchCache[cacheKey]) {
      console.log('使用缓存的搜索结果');
      setResults(searchCache[cacheKey]);
      return;
    }

    console.log('开始新的搜索请求');
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // 构建API URL
      const params = new URLSearchParams();
      params.append('q', query);
      if (category) {
        params.append('category', category);
      }

      // 添加时间戳避免缓存
      params.append('t', Date.now().toString());

      const url = `/api/search?${params.toString()}`;

      // 执行搜索请求
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`搜索失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // 更新结果
      console.log('搜索结果:', data.results);
      setResults(data.results || []);

      // 更新缓存
      setSearchCache(prev => ({
        ...prev,
        [cacheKey]: data.results || []
      }));
    } catch (err) {
      setIsError(true);
      setError((err as Error).message || '搜索时发生错误');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [clearResults, lastQuery, searchCache]);

  // 保存搜索历史
  const saveSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    try {
      // 检查是否在浏览器环境中
      if (typeof window === 'undefined') {
        return;
      }

      // 获取现有历史
      const historyJson = localStorage.getItem('searchHistory');
      const history = historyJson ? JSON.parse(historyJson) : [];

      // 添加新查询
      const newHistory = [
        { query, timestamp: Date.now() },
        ...history.filter((item: { query: string }) => item.query !== query)
      ].slice(0, 10); // 只保留最近10条

      // 保存历史
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  }, []);

  // 获取搜索历史
  const getSearchHistory = useCallback(() => {
    try {
      // 检查是否在浏览器环境中
      if (typeof window === 'undefined') {
        return [];
      }
      const historyJson = localStorage.getItem('searchHistory');
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('获取搜索历史失败:', error);
      return [];
    }
  }, []);

  // 清除搜索历史
  const clearSearchHistory = useCallback(() => {
    try {
      // 检查是否在浏览器环境中
      if (typeof window === 'undefined') {
        return;
      }
      localStorage.removeItem('searchHistory');
    } catch (error) {
      console.error('清除搜索历史失败:', error);
    }
  }, []);

  // 执行搜索并保存历史
  const searchWithHistory = useCallback(async (query: string, category?: string) => {
    await search(query, category);
    if (query.trim()) {
      saveSearchHistory(query);
    }
  }, [search, saveSearchHistory]);

  return {
    results,
    isLoading,
    isError,
    error,
    search: searchWithHistory,
    clearResults,
    getSearchHistory,
    clearSearchHistory
  };
}
