"use client";

import { type CategoryWithCount, getAllPosts } from "@/features/blog/hooks";
import type { BlogPost } from "@/features/blog/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// 分页配置
const PAGE_SIZE = 10;

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

  // 分页状态
  currentPage: number;
  totalPages: number;
  paginatedPosts: BlogPost[];

  // 加载状态
  loading: boolean;

  // 过滤状态
  category: string | undefined;
  tag: string | undefined;

  // 事件处理器
  handleCategoryClick: (newCategory: string | null) => void;
  handleTagClick: (newTag: string | null) => void;
  handlePageChange: (page: number) => void;

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
  const [currentPage, setCurrentPage] = useState(1);

  const { category, tag } = Object.fromEntries(searchParams.entries());

  // 加载文章数据
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to load posts", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  // 过滤文章
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (category && post.category !== category) return false;
      if (tag && !post.tags?.includes(tag)) return false;
      return true;
    });
  }, [posts, category, tag]);

  // 分页处理
  const totalPages = useMemo(() => {
    return Math.ceil(filteredPosts.length / PAGE_SIZE);
  }, [filteredPosts.length]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredPosts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredPosts, currentPage]);

  // 分类统计（带缓存）
  const { categories, postsCount } = useMemo(() => {
    // 创建缓存键
    const cacheKey = `blog_categories_${posts.length}_${category ?? "all"}_${tag ?? "all"}`;

    // 检查sessionStorage缓存
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        // 检查缓存是否过期（5分钟）
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          return {
            categories: parsed.categories,
            postsCount: parsed.postsCount,
          };
        }
      }
    } catch {
      // 忽略缓存解析错误
    }

    // 重新计算分类统计
    const categoriesCount: Record<string, number> = {};
    posts.forEach(post => {
      if (post.category) {
        categoriesCount[post.category] = (categoriesCount[post.category] || 0) + 1;
      }
    });

    const categories: CategoryWithCount[] = Object.entries(categoriesCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 重新计算标签统计
    const postsCount: Record<string, number> = {};
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        postsCount[tag] = (postsCount[tag] || 0) + 1;
      });
    });

    // 保存到缓存
    try {
      const cacheData = {
        categories,
        postsCount,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch {
      // 忽略缓存保存错误
    }

    return { categories, postsCount };
  }, [posts, category, tag]);

  // 相关文章（取最新的10篇，带缓存）
  const relatedPosts = useMemo(() => {
    // 创建缓存键
    const cacheKey = `blog_related_${posts.length}`;

    // 检查sessionStorage缓存
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        // 检查缓存是否过期（5分钟）
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          return parsed.relatedPosts as UseBlogPageReturn["relatedPosts"];
        }
      }
    } catch {
      // 忽略缓存解析错误
    }

    // 重新计算相关文章
    const related = posts.slice(0, 10).map(post => ({
      title: post.title ?? "",
      href: `/blog/${post.slug ?? ""}`,
      category: post.category,
      slug: post.slug ? post.slug.split("/") : [],
    }));

    // 保存到缓存
    try {
      const cacheData = {
        relatedPosts: related,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch {
      // 忽略缓存保存错误
    }

    return related;
  }, [posts]);

  // 最新发布的文章（带缓存）
  const latestPosts = useMemo(() => {
    // 创建缓存键
    const cacheKey = `blog_latest_${posts.length}`;

    // 检查sessionStorage缓存
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        // 检查缓存是否过期（5分钟）
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          return parsed.latestPosts as UseBlogPageReturn["latestPosts"];
        }
      }
    } catch {
      // 忽略缓存解析错误
    }

    // 重新计算最新文章
    const latest = posts
      .filter(post => post.date)
      .slice(0, 5)
      .map(post => ({
        title: post.title ?? "",
        href: `/blog/${post.slug ?? ""}`,
        date: post.date?.toString(),
        category: post.category,
      }));

    // 保存到缓存
    try {
      const cacheData = {
        latestPosts: latest,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch {
      // 忽略缓存保存错误
    }

    return latest;
  }, [posts]);

  // 处理分类点击
  const handleCategoryClick = (newCategory: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      newParams.set("category", newCategory);
    } else {
      newParams.delete("category");
    }
    // 重置页码
    newParams.delete("page");
    router.push(`/blog?${newParams.toString()}`, { scroll: false });
    setCurrentPage(1);
  };

  // 处理标签点击
  const handleTagClick = (newTag: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newTag) {
      newParams.set("tag", newTag);
    } else {
      newParams.delete("tag");
    }
    // 重置页码
    newParams.delete("page");
    router.push(`/blog?${newParams.toString()}`, { scroll: false });
    setCurrentPage(1);
  };

  // 处理页码变更
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", page.toString());
    router.push(`/blog?${newParams.toString()}`, { scroll: false });
    setCurrentPage(page);
  };

  // 监听URL参数变化以更新当前页码
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    if (!Number.isNaN(page) && page > 0) {
      setCurrentPage(page);
    } else {
      setCurrentPage(1);
    }
  }, [searchParams]);

  return {
    // 数据状态
    posts,
    filteredPosts,
    categories,
    postsCount,
    relatedPosts,
    latestPosts,

    // 分页状态
    currentPage,
    totalPages,
    paginatedPosts,

    // 加载状态
    loading,

    // 过滤状态
    category,
    tag,

    // 事件处理器
    handleCategoryClick,
    handleTagClick,
    handlePageChange,

    // 刷新数据
    refreshData: loadPosts,
  };
}
