/**
 * 统计数据相关钩子函数
 * @module hooks/use-site-stats
 */

"use client";

import { useBlogPosts } from "@/features/blog/hooks";
import { useDocCategories } from "@/features/docs/hooks";
import type { SiteStats } from "@/features/home/types";
import { useMemo } from "react";

/**
 * 获取网站统计数据
 * @returns 网站各模块的统计数据
 */
export function useSiteStats(): SiteStats & { refresh: () => void } {
  // 禁用缓存，确保每次都从服务器获取最新数据
  const {
    posts: blogPosts,
    loading: blogLoading,
    error: blogError,
    refresh: refreshBlog,
  } = useBlogPosts();
  const {
    data: docCategories,
    loading: docLoading,
    error: docError,
    refresh: refreshDocs,
  } = useDocCategories();

  const stats = useMemo(() => {
    // 博客数量
    const blogCount = blogPosts?.length || 0;

    // 文档数量 - 计算所有分类下的文档总数
    const docCount =
      docCategories?.reduce(
        (total: number, category: { count?: number }) => total + (category.count ?? 0),
        0
      ) ?? 0;

    // 友链数量 - 从友链功能获取
    const friendCount = 0; // TODO: 从友链功能获取实际数量

    return {
      blogCount,
      docCount,
      friendCount,
    };
  }, [blogPosts, docCategories]);

  const loading = blogLoading || docLoading;
  const error = blogError?.message ?? docError?.message ?? null;

  return {
    ...stats,
    loading,
    error,
    refresh: () => {
      refreshBlog();
      refreshDocs();
    },
  };
}
