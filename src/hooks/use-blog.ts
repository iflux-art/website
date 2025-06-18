/**
 * 博客相关钩子函数
 * @module hooks/use-blog
 */

'use client';

import { useMemo } from 'react';
import { useContentData } from '@/hooks/use-content-data';
import { BlogPost } from '@/types/blog-types';
export type { BlogPost } from '@/types/blog-types';

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
 * @returns 博客文章列表
 */
export function useBlogPosts() {
  const { data: posts = [] } = useContentData<BlogPost[]>({
    type: 'blog',
    path: '/api/blog/posts',
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

  return { posts: sortedPosts, postsCount, categories };
}

/**
 * 使用标签统计
 *
 * @returns 标签统计列表
 */
export function useTagCounts() {
  const { data } = useContentData<Record<string, number>>({
    type: 'blog',
    path: '/api/blog/tags/count',
  });

  const tagCounts = useMemo(() => {
    if (!data) return [];
    const countsArray = Object.entries(data).map(([tag, count]) => ({
      tag,
      count: count as number,
    }));

    return countsArray.sort((a, b) => b.count - a.count);
  }, [data]);

  return { tagCounts };
}

/**
 * 使用按年份分组的博客文章
 *
 * @returns 按年份分组的博客文章
 */
export function useTimelinePosts() {
  const { data: postsByYear = {} } = useContentData<Record<string, BlogPost[]>>({
    type: 'blog',
    path: '/api/blog/timeline',
  });

  return { postsByYear };
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
