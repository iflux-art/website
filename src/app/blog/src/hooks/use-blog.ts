/**
 * 博客相关钩子函数
 * @module hooks/use-blog
 */

"use client";

import { useMemo } from "react";
import { useContentData } from "packages/src/hooks/use-content-data";
import { API_PATHS } from "packages/src/config/metadata";
import type { HookResult } from "packages/src/hooks/use-content-data";
import { BlogPost } from "../types/blog-types";

export interface TagCount {
  tag: string;
  count: number;
}

// 内联 BlogResult、UseBlogPostsResult、UseTimelinePostsResult 类型定义
export interface BlogResult<T> extends HookResult<T> {
  loading: boolean;
  error: Error | null;
}

export interface UseBlogPostsResult extends BlogResult<BlogPost[]> {
  posts: BlogPost[];
  postsCount: Record<string, number>;
  categories: string[];
}

export interface UseTimelinePostsResult
  extends BlogResult<Record<string, BlogPost[]>> {
  postsByYear: Record<string, BlogPost[]>;
}
/**
 * 按日期对博客文章进行排序
 */
function sortPostsByDate(posts: BlogPost[] | null | undefined) {
  if (!posts || !Array.isArray(posts)) return [];
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
    loading,
    error,
    refresh,
  } = useContentData<BlogPost[]>({
    type: "blog",
    path: API_PATHS.BLOG.POSTS,
  });

  const sortedPosts = useMemo(() => sortPostsByDate(posts), [posts]);

  const { postsCount, categories } = useMemo(() => {
    const postsCount: Record<string, number> = {};
    const categoriesSet = new Set<string>();

    sortedPosts?.forEach((post) => {
      // 处理标签统计
      post.tags?.forEach((tag) => {
        postsCount[tag] = (postsCount[tag] || 0) + 1;
      });

      // 处理分类统计
      if (post.category) {
        categoriesSet.add(post.category);
      }
    });

    return {
      postsCount,
      categories: Array.from(categoriesSet),
    };
  }, [sortedPosts]);

  return {
    data: sortedPosts,
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
  const { data, loading, error, refresh } = useContentData<
    Record<string, number>
  >({
    type: "blog",
    path: API_PATHS.BLOG.TAGS_COUNT,
  });

  const tagCounts = useMemo(() => {
    if (!data) return [];
    const countsArray = Object.entries(data).map(([tag, count]) => ({
      tag,
      count: count as number,
    }));

    return countsArray.sort((a, b) => b.count - a.count);
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
  const { data, loading, error, refresh } = useContentData<
    Record<string, BlogPost[]>
  >({
    type: "blog",
    path: API_PATHS.BLOG.TIMELINE,
  });

  return {
    data,
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

  const posts: BlogPost[] = await response.json();
  return sortPostsByDate(posts);
}
