/**
 * 博客相关钩子函数
 * @module hooks/use-blog
 */

"use client";

import type { BlogPost, CategoryWithCount } from "@/features/blog/types";
import { API_PATHS } from "@/lib/api/api-paths";
import { useMemo } from "react";
import { type HookResult, useContentData } from "../../../hooks/use-content-data";

export interface TagCount {
  tag: string;
  count: number;
}

// 内联 BlogResult、UseBlogPostsResult、UseTimelinePostsResult 类型定义
export interface BlogResult<T> extends HookResult<T> {
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export interface UseBlogPostsResult extends BlogResult<BlogPost[]> {
  posts: BlogPost[];
  postsCount: Record<string, number>;
  categories: CategoryWithCount[];
}

// 导出 CategoryWithCount 类型供外部使用
export type { CategoryWithCount };

export interface UseTimelinePostsResult extends BlogResult<Record<string, BlogPost[]>> {
  postsByYear: Record<string, BlogPost[]>;
}
/**
 * 按日期对博客文章进行排序
 */
function sortPostsByDate(posts: BlogPost[] | null | undefined) {
  if (!(posts && Array.isArray(posts))) return [];
  return [...posts].sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}

/**
 * 使用博客文章列表
 *
 * @returns 博客文章列表
 */
export function useBlogPosts(): UseBlogPostsResult {
  const {
    data: posts,
    loading: dataLoading,
    error,
    refresh,
  } = useContentData<BlogPost[]>({
    type: "blog",
    path: API_PATHS.blog.Posts,
    disableCache: false, // 启用缓存
    params: { cache: "force-cache" }, // 使用服务器缓存
    forceRefresh: false, // 禁用强制刷新
  });

  const sortedPosts = useMemo(() => sortPostsByDate(posts), [posts]);

  const { postsCount, categories, isComputing } = useMemo(() => {
    const postsCount: Record<string, number> = {};
    const categoriesCount: Record<string, number> = {};

    if (!sortedPosts) {
      return { postsCount: {}, categories: [], isComputing: true };
    }

    sortedPosts.forEach(post => {
      // 处理标签统计
      post.tags?.forEach(tag => {
        postsCount[tag] = (postsCount[tag] || 0) + 1;
      });

      // 处理分类统计
      if (post.category) {
        categoriesCount[post.category] = (categoriesCount[post.category] || 0) + 1;
      }
    });

    // 转换为带计数的分类数组
    const categories: CategoryWithCount[] = Object.entries(categoriesCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      postsCount,
      categories,
      isComputing: false,
    };
  }, [sortedPosts]);

  const loading = dataLoading || isComputing;

  return {
    data: sortedPosts ?? [],
    posts: sortedPosts ?? [],
    loading,
    error,
    refresh,
    postsCount,
    categories,
  };
}

/**
 * 使用标签统计
 *
 * @returns 标签统计列表
 */
export function useTagCounts(): HookResult<TagCount[]> {
  const { data, loading, error, refresh } = useContentData<Record<string, number>>({
    type: "blog",
    path: API_PATHS.blog.TagsCount,
  });

  const tagCounts = useMemo(() => {
    if (!data) return [];
    const countsArray = Object.entries(data).map(([tag, count]) => ({
      tag,
      count: count as number,
    }));

    return countsArray.sort((a, b) => (b.count as number) - (a.count as number));
  }, [data]);

  return {
    data: tagCounts,
    loading,
    error,
    refresh,
  };
}

/**
 * 使用按年份分组的博客文章
 *
 * @returns 按年份分组的博客文章
 */
export function useTimelinePosts(): UseTimelinePostsResult {
  const { data, loading, error, refresh } = useContentData<Record<string, BlogPost[]>>({
    type: "blog",
    path: API_PATHS.blog.Timeline,
  });

  return {
    data: data ?? {},
    postsByYear: data ?? {},
    loading,
    error,
    refresh,
  };
}

/**
 * 获取所有博客文章
 * @returns 所有博客文章列表
 */
export async function getAllPosts() {
  const response = await fetch("/api/blog/posts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("获取博客文章失败");
  }

  const posts = (await response.json()) as BlogPost[];
  return sortPostsByDate(posts);
}

// Blog 页面状态管理 Hook
export { useBlogPage } from "./use-blog-page";
