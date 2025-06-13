/**
 * 博客相关钩子函数
 * @module hooks/use-blog
 */

"use client";

import { useMemo } from 'react';
import { useContentData } from '@/hooks/use-content-data';

/**
 * 按日期对博客文章进行排序
 */
function sortPostsByDate(posts: BlogPost[] | null) {
  if (!posts) return [];
  return [...posts].sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}


/**
 * 博客文章
 */
export interface BlogPost {
  /**
   * 文章唯一标识（URL 路径）
   */
  slug: string;

  /**
   * 文章标题
   */
  title: string;

  /**
   * 文章描述
   */
  description: string;

  /**
   * 文章摘要
   */
  excerpt: string;

  /**
   * 发布日期
   */
  date?: string;

  /**
   * 标签列表
   */
  tags: string[];

  /**
   * 作者
   */
  author?: string;

  /**
   * 作者头像
   */
  authorAvatar?: string | null;

  /**
   * 作者简介
   */
  authorBio?: string;

  /**
   * 是否已发布
   */
  published?: boolean;
}

/**
 * 相关文章
 */
export interface RelatedPost {
  /**
   * 文章唯一标识（URL 路径）
   */
  slug: string;

  /**
   * 文章标题
   */
  title: string;

  /**
   * 文章摘要
   */
  excerpt: string;
}

/**
 * 标签统计
 */
export interface TagCount {
  /**
   * 标签名称
   */
  tag: string;

  /**
   * 文章数量
   */
  count: number;
}

/**
 * 使用博客文章列表
 *
 * @returns 博客文章列表和加载状态
 */
export function useBlogPosts() {
  const { data: posts = [], loading, error } = useContentData<BlogPost[]>({
    type: 'blog',
    path: '/api/blog/posts',
    errorMessage: '获取博客文章失败'
  });

  // 按日期排序的文章
  const sortedPosts = useMemo(() => sortPostsByDate(posts), [posts]);

  // 计算每个标签的文章数量
  const postsCount = useMemo(() => {
    return sortedPosts?.reduce((acc, post) => {
      post.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>) ?? {};
  }, [sortedPosts]);

  return { posts: sortedPosts, postsCount, loading, error };
}

/**
 * 使用标签过滤的博客文章
 *
 * @param tag 标签名称
 * @returns 包含指定标签的博客文章列表和加载状态
 */
export function useTaggedPosts(tag: string) {
  const { data: posts = [], loading, error } = useContentData<BlogPost[]>({
    type: 'blog',
    path: `/api/blog/tags/${encodeURIComponent(tag)}`,
    errorMessage: '获取标签文章失败'
  });

  // 按日期排序的文章
  const sortedPosts = useMemo(() => sortPostsByDate(posts), [posts]);

  return { posts: sortedPosts, loading, error };
}

/**
 * 使用所有标签
 *
 * @returns 所有标签列表和加载状态
 */
export function useTags() {
  const { posts, loading, error } = useBlogPosts();
  
  // 从文章中提取所有唯一标签
  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    posts?.forEach(post => {
      post.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [posts]);

  return { tags, loading, error };
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
    errorMessage: '获取标签统计失败'
  });

  const tagCounts = useMemo(() => {
    if (!data) return [];
    // 将对象转换为数组
    const countsArray = Object.entries(data).map(([tag, count]) => ({
      tag,
      count: count as number,
    }));

    // 按文章数量排序
    return countsArray.sort((a, b) => b.count - a.count);
  }, [data]);

  return { tagCounts, loading, error };
}

/**
 * 使用相关文章
 *
 * @param slug 当前文章的 slug
 * @param limit 相关文章数量限制
 * @returns 相关文章列表和加载状态
 */
export function useRelatedPosts(slug: string, limit: number = 3) {
  const { data: relatedPosts = [], loading, error } = useContentData<RelatedPost[]>({
    type: 'blog',
    path: `/api/blog/related/${encodeURIComponent(slug)}?limit=${limit}`,
    errorMessage: '获取相关文章失败',
    dependencies: [slug, limit]
  });

  return { relatedPosts, loading, error };
}

/**
 * 使用按年份分组的博客文章
 *
 * @returns 按年份分组的博客文章和加载状态
 */
export function useTimelinePosts() {
  const { data: postsByYear = {}, loading, error } = useContentData<Record<string, BlogPost[]>>({
    type: 'blog',
    path: '/api/blog/timeline',
    errorMessage: '获取时间线文章失败'
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