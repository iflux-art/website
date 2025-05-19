/**
 * 博客相关钩子函数
 * @module hooks/use-blog
 */

import { useState, useEffect, useMemo } from 'react';
import { BlogPost, RelatedPost, TagCount } from '@/types/blog';

/**
 * 使用博客文章列表
 * 
 * @returns 博客文章列表和加载状态
 */
export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch('/api/blog/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // 按日期排序的文章
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  }, [posts]);

  return { posts: sortedPosts, loading, error };
}

/**
 * 使用标签过滤的博客文章
 * 
 * @param tag 标签名称
 * @returns 包含指定标签的博客文章列表和加载状态
 */
export function useTaggedPosts(tag: string) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTaggedPosts() {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/tags/${encodeURIComponent(tag)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch posts with tag: ${tag}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchTaggedPosts();
  }, [tag]);

  // 按日期排序的文章
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  }, [posts]);

  return { posts: sortedPosts, loading, error };
}

/**
 * 使用所有标签
 * 
 * @returns 所有标签列表和加载状态
 */
export function useTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        setLoading(true);
        const response = await fetch('/api/blog/tags');
        if (!response.ok) {
          throw new Error('Failed to fetch tags');
        }
        const data = await response.json();
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  return { tags, loading, error };
}

/**
 * 使用标签统计
 * 
 * @returns 标签统计列表和加载状态
 */
export function useTagCounts() {
  const [tagCounts, setTagCounts] = useState<TagCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTagCounts() {
      try {
        setLoading(true);
        const response = await fetch('/api/blog/tags/count');
        if (!response.ok) {
          throw new Error('Failed to fetch tag counts');
        }
        const data = await response.json();
        
        // 将对象转换为数组
        const countsArray = Object.entries(data).map(([tag, count]) => ({
          tag,
          count: count as number
        }));
        
        // 按文章数量排序
        const sortedCounts = countsArray.sort((a, b) => b.count - a.count);
        
        setTagCounts(sortedCounts);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchTagCounts();
  }, []);

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
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/related/${encodeURIComponent(slug)}?limit=${limit}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch related posts for: ${slug}`);
        }
        const data = await response.json();
        setRelatedPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedPosts();
  }, [slug, limit]);

  return { relatedPosts, loading, error };
}
