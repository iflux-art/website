"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { BlogPost } from "@/features/blog/types";

interface FilterResult {
  posts: BlogPost[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
}

interface FilterOptions {
  sortBy?: "date" | "title" | "views";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

interface UseArticleFilterReturn {
  filterByCategory: (
    posts: BlogPost[],
    category: string,
    options?: FilterOptions,
  ) => FilterResult;
  filterByTag: (
    posts: BlogPost[],
    tag: string,
    options?: FilterOptions,
  ) => FilterResult;
  filterByMultipleTags: (
    posts: BlogPost[],
    tags: string[],
    options?: FilterOptions,
  ) => FilterResult;
  clearCache: () => void;
  isFiltering: boolean;
  cacheStats: {
    size: number;
    hitRate: number;
  };
}

/**
 * 文章筛选逻辑 Hook
 *
 * 功能特性：
 * - 按分类筛选文章的功能
 * - 按标签筛选文章的功能
 * - 按多个标签筛选文章的功能
 * - 筛选结果的缓存机制
 * - 处理筛选过程中的加载状态
 * - 支持排序和分页选项
 * - 缓存命中率统计
 */
export function useArticleFilter(): UseArticleFilterReturn {
  const [isFiltering, setIsFiltering] = useState(false);
  const [cacheStatsState, setCacheStatsState] = useState({
    size: 0,
    hitRate: 0,
  });

  const filterCache = useRef(new Map<string, FilterResult>());
  const cacheHits = useRef(0);
  const cacheRequests = useRef(0);

  // 缓存清理 - 限制缓存大小
  const MAX_CACHE_SIZE = 50;

  useEffect(() => {
    const interval = setInterval(() => {
      if (filterCache.current.size > MAX_CACHE_SIZE) {
        // 清理最旧的缓存项
        const keys = Array.from(filterCache.current.keys());
        const keysToDelete = keys.slice(0, keys.length - MAX_CACHE_SIZE);
        keysToDelete.forEach((key) => filterCache.current.delete(key));
      }
    }, 60000); // 每分钟检查一次

    return () => clearInterval(interval);
  }, []);

  // 更新缓存统计
  const updateCacheStats = useCallback(() => {
    setCacheStatsState({
      size: filterCache.current.size,
      hitRate:
        cacheRequests.current > 0
          ? cacheHits.current / cacheRequests.current
          : 0,
    });
  }, []);

  // 生成缓存键
  const generateCacheKey = useCallback(
    (
      type: "category" | "tag" | "multi-tag",
      value: string | string[],
      postsHash: string,
      options?: FilterOptions,
    ) => {
      const valueStr = Array.isArray(value) ? value.sort().join(",") : value;
      const optionsStr = options ? JSON.stringify(options) : "";
      return `filter:${type}:${valueStr}:${postsHash}:${optionsStr}`;
    },
    [],
  );

  // 生成文章列表的哈希值（用于缓存键）
  const generatePostsHash = useCallback((posts: BlogPost[]) => {
    if (!posts || posts.length === 0) return "empty";
    // 使用文章数量和最新文章的日期作为简化的哈希
    const latestDate = posts[0]?.date || "";
    return `${posts.length}-${latestDate}`;
  }, []);

  // 排序文章
  const sortPosts = useCallback(
    (posts: BlogPost[], options?: FilterOptions): BlogPost[] => {
      const { sortBy = "date", sortOrder = "desc" } = options || {};

      return [...posts].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "date":
            if (a.date && b.date) {
              comparison =
                new Date(a.date).getTime() - new Date(b.date).getTime();
            }
            break;
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "views":
            comparison = (a.views || 0) - (b.views || 0);
            break;
          default:
            comparison = 0;
        }

        return sortOrder === "desc" ? -comparison : comparison;
      });
    },
    [],
  );

  // 应用分页
  const applyPagination = useCallback(
    (posts: BlogPost[], options?: FilterOptions): BlogPost[] => {
      const { limit, offset = 0 } = options || {};

      if (limit) {
        return posts.slice(offset, offset + limit);
      }

      return posts;
    },
    [],
  );

  // 执行筛选的通用函数
  const executeFilter = useCallback(
    (
      posts: BlogPost[],
      filterFn: (post: BlogPost) => boolean,
      cacheKey: string,
      options?: FilterOptions,
    ): FilterResult => {
      cacheRequests.current++;

      // 检查缓存
      const cached = filterCache.current.get(cacheKey);
      if (cached) {
        cacheHits.current++;
        updateCacheStats();
        return cached;
      }

      setIsFiltering(true);

      try {
        // 执行筛选逻辑
        const filteredPosts = posts.filter(filterFn);

        // 排序
        const sortedPosts = sortPosts(filteredPosts, options);

        // 应用分页
        const paginatedPosts = applyPagination(sortedPosts, options);

        const result: FilterResult = {
          posts: paginatedPosts,
          isLoading: false,
          error: null,
          totalCount: filteredPosts.length,
        };

        // 缓存结果
        filterCache.current.set(cacheKey, result);
        updateCacheStats();

        setIsFiltering(false);
        return result;
      } catch (error) {
        const result: FilterResult = {
          posts: [],
          isLoading: false,
          error:
            error instanceof Error ? error : new Error("筛选过程中发生错误"),
          totalCount: 0,
        };

        setIsFiltering(false);
        return result;
      }
    },
    [sortPosts, applyPagination, updateCacheStats],
  );

  // 按分类筛选文章
  const filterByCategory = useCallback(
    (
      posts: BlogPost[],
      category: string,
      options?: FilterOptions,
    ): FilterResult => {
      if (!posts || !category) {
        return { posts: [], isLoading: false, error: null, totalCount: 0 };
      }

      const postsHash = generatePostsHash(posts);
      const cacheKey = generateCacheKey(
        "category",
        category,
        postsHash,
        options,
      );

      return executeFilter(
        posts,
        (post) => post.category === category,
        cacheKey,
        options,
      );
    },
    [generateCacheKey, generatePostsHash, executeFilter],
  );

  // 按标签筛选文章
  const filterByTag = useCallback(
    (posts: BlogPost[], tag: string, options?: FilterOptions): FilterResult => {
      if (!posts || !tag) {
        return { posts: [], isLoading: false, error: null, totalCount: 0 };
      }

      const postsHash = generatePostsHash(posts);
      const cacheKey = generateCacheKey("tag", tag, postsHash, options);

      return executeFilter(
        posts,
        (post) => post.tags?.includes(tag) ?? false,
        cacheKey,
        options,
      );
    },
    [generateCacheKey, generatePostsHash, executeFilter],
  );

  // 按多个标签筛选文章（包含所有标签的文章）
  const filterByMultipleTags = useCallback(
    (
      posts: BlogPost[],
      tags: string[],
      options?: FilterOptions,
    ): FilterResult => {
      if (!posts || !tags || tags.length === 0) {
        return { posts: [], isLoading: false, error: null, totalCount: 0 };
      }

      const postsHash = generatePostsHash(posts);
      const cacheKey = generateCacheKey("multi-tag", tags, postsHash, options);

      return executeFilter(
        posts,
        (post) => tags.every((tag) => post.tags?.includes(tag) ?? false),
        cacheKey,
        options,
      );
    },
    [generateCacheKey, generatePostsHash, executeFilter],
  );

  // 清除缓存
  const clearCache = useCallback(() => {
    filterCache.current.clear();
    cacheHits.current = 0;
    cacheRequests.current = 0;
    updateCacheStats();
  }, [updateCacheStats]);

  return {
    filterByCategory,
    filterByTag,
    filterByMultipleTags,
    clearCache,
    isFiltering,
    cacheStats: cacheStatsState,
  };
}
