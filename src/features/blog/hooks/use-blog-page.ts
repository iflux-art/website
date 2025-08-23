'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { BlogPost } from '@/features/blog/types';
import { type CategoryWithCount, getAllPosts } from '@/features/blog/hooks';

export interface UseBlogPageReturn {
  // 数据状态
  posts: BlogPost[];
  filteredPosts: BlogPost[];
  categories: CategoryWithCount[];
  postsCount: Record<string, number>;
  relatedPosts: {
    title: string;
    href: string;
    category: string | undefined;
    slug: string[];
  }[];
  latestPosts: {
    title: string;
    href: string;
    date: string | undefined;
    category: string | undefined;
  }[];

  // 加载状态
  loading: boolean;

  // 过滤状态
  category: string | undefined;
  tag: string | undefined;

  // 事件处理器
  handleCategoryClick: (newCategory: string | null) => void;
  handleTagClick: (newTag: string | null) => void;

  // 刷新数据
  refreshData: () => Promise<void>;
}

/**
 * Blog页面状态管理Hook
 * 封装了博客页面的所有状态管理和数据处理逻辑
 */
export function useBlogPage(): UseBlogPageReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const { category, tag } = Object.fromEntries(searchParams.entries());

  // 加载文章数据
  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  // 过滤文章
  const filteredPosts = posts.filter(post => {
    if (category && post.category !== category) return false;
    if (tag && !post.tags?.includes(tag)) return false;
    return true;
  });

  // 分类统计
  const categoriesCount: Record<string, number> = {};
  posts.forEach(post => {
    if (post.category) {
      categoriesCount[post.category] = (categoriesCount[post.category] || 0) + 1;
    }
  });

  const categories: CategoryWithCount[] = Object.entries(categoriesCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 标签统计
  const postsCount: Record<string, number> = {};
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      postsCount[tag] = (postsCount[tag] || 0) + 1;
    });
  });

  // 相关文章（取最新的10篇）
  const relatedPosts = posts.slice(0, 10).map(post => ({
    title: post.title,
    href: `/blog/${post.slug}`,
    category: post.category,
    slug: post.slug.split('/'),
  }));

  // 最新发布的文章
  const latestPosts = posts
    .filter(post => post.date)
    .slice(0, 5)
    .map(post => ({
      title: post.title,
      href: `/blog/${post.slug}`,
      date: post.date?.toString(),
      category: post.category,
    }));

  // 处理分类点击
  const handleCategoryClick = (newCategory: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      newParams.set('category', newCategory);
    } else {
      newParams.delete('category');
    }
    router.push(`/blog?${newParams.toString()}`, { scroll: false });
  };

  // 处理标签点击
  const handleTagClick = (newTag: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newTag) {
      newParams.set('tag', newTag);
    } else {
      newParams.delete('tag');
    }
    router.push(`/blog?${newParams.toString()}`, { scroll: false });
  };

  return {
    // 数据状态
    posts,
    filteredPosts,
    categories,
    postsCount,
    relatedPosts,
    latestPosts,

    // 加载状态
    loading,

    // 过滤状态
    category,
    tag,

    // 事件处理器
    handleCategoryClick,
    handleTagClick,

    // 刷新数据
    refreshData: loadPosts,
  };
}
