/**
 * 博客相关钩子函数
 * @module hooks/use-blog
 */

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname(); // 获取当前路径
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [dataFetched, setDataFetched] = useState(false); // 标记数据是否已获取

  useEffect(() => {
    async function fetchPosts() {
      // 如果已经在加载中，则不重复加载
      if (loading && dataFetched) return;

      setLoading(true);
      try {
        console.log('获取博客文章列表中...', pathname);
        // 添加时间戳避免缓存
        const response = await fetch('/api/blog/posts?t=' + Date.now());
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        console.log('博客文章获取成功', data.length);
        setPosts(data);
        setDataFetched(true); // 标记数据已获取
      } catch (err) {
        console.error('获取博客文章失败:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [pathname]); // 添加pathname作为依赖，当路径变化时重新获取数据

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
          count: count as number,
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
        const response = await fetch(
          `/api/blog/related/${encodeURIComponent(slug)}?limit=${limit}`
        );
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

/**
 * 使用按年份分组的博客文章
 *
 * @returns 按年份分组的博客文章和加载状态
 */
export function useTimelinePosts() {
  const [postsByYear, setPostsByYear] = useState<Record<string, BlogPost[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTimelinePosts() {
      try {
        setLoading(true);
        const response = await fetch('/api/blog/timeline');
        if (!response.ok) {
          throw new Error('Failed to fetch timeline posts');
        }
        const data = await response.json();
        setPostsByYear(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchTimelinePosts();
  }, []);

  return { postsByYear, loading, error };
}
