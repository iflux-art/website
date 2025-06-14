/**
 * 博客相关钩子函数
 * @module hooks/use-blog
 */

'use client';

import { useMemo } from 'react';
import { useContentData } from '@/hooks/use-content-data';
import { BlogPost } from '@/components/features/blog/blog-types';
export type { BlogPost } from '@/components/features/blog/blog-types';

export interface TagCount {
  tag: string;
  count: number;
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
 * @returns 博客文章列表和加载状态
 */
export function useBlogPosts() {
  const {
    data: posts = [],
    loading,
    error,
  } = useContentData<BlogPost[]>({
    type: 'blog',
    path: '/api/blog/posts',
    errorMessage: '获取博客文章失败',
  });

  const sortedPosts = useMemo(() => sortPostsByDate(posts), [posts]);

  const postsCount = useMemo(() => {
    return (
      sortedPosts?.reduce((acc, post) => {
        post.tags?.forEach(tag => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>) ?? {}
    );
  }, [sortedPosts]);

  return { posts: sortedPosts, postsCount, loading, error };
}

/**
 * 使用标签统计
 *
 * @returns 标签统计列表和加载状态
 */
export function useTagCounts() {
  const { data, loading, error } = useContentData<Record<string, number>>({
    type: 'blog',
    path: '/api/blog/tags/count',
    errorMessage: '获取标签统计失败',
  });

  const tagCounts = useMemo(() => {
    if (!data) return [];
    const countsArray = Object.entries(data).map(([tag, count]) => ({
      tag,
      count: count as number,
    }));

    return countsArray.sort((a, b) => b.count - a.count);
  }, [data]);

  return { tagCounts, loading, error };
}

/**
 * 使用按年份分组的博客文章
 *
 * @returns 按年份分组的博客文章和加载状态
 */
export function useTimelinePosts() {
  const {
    data: postsByYear = {},
    loading,
    error,
  } = useContentData<Record<string, BlogPost[]>>({
    type: 'blog',
    path: '/api/blog/timeline',
    errorMessage: '获取时间线文章失败',
  });

  return { postsByYear, loading, error };
}

/**
 * 获取所有博客文章
 * @returns 所有博客文章列表
 */
export async function getAllPosts() {
  const response = await fetch('/api/blog/posts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('获取博客文章失败');
  }

  const posts: BlogPost[] = await response.json();
  return sortPostsByDate(posts);
}