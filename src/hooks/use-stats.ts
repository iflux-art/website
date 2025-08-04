/**
 * 统计数据相关钩子函数
 * @module hooks/use-stats
 */

"use client";

import { useMemo } from "react";
import { useBlogPosts } from "@/hooks/use-blog";
import { useDocCategories } from "@/hooks/use-docs";
import { useLinksData } from "@/hooks/use-links-data";

export interface SiteStats {
  blogCount: number;
  docCount: number;
  linkCount: number;
  friendCount: number;
  loading: boolean;
  error: string | null;
}

/**
 * 获取网站统计数据
 * @returns 网站各模块的统计数据
 */
export function useSiteStats(): SiteStats {
  const {
    posts: blogPosts,
    loading: blogLoading,
    error: blogError,
  } = useBlogPosts();
  const {
    data: docCategories,
    loading: docLoading,
    error: docError,
  } = useDocCategories();
  const {
    items: linkItems,
    loading: linkLoading,
    error: linkError,
  } = useLinksData();

  const stats = useMemo(() => {
    // 博客数量
    const blogCount = blogPosts?.length || 0;

    // 文档数量 - 计算所有分类下的文档总数
    const docCount =
      docCategories?.reduce((total, category) => {
        return total + (category.count || 0);
      }, 0) || 0;

    // 导航链接数量 - 排除友链分类
    const linkCount =
      linkItems?.filter((item) => item.category !== "friends").length || 0;

    // 友链数量
    const friendCount =
      linkItems?.filter((item) => item.category === "friends").length || 0;

    return {
      blogCount,
      docCount,
      linkCount,
      friendCount,
    };
  }, [blogPosts, docCategories, linkItems]);

  const loading = blogLoading || docLoading || linkLoading;
  const error = blogError?.message || docError?.message || linkError || null;

  return {
    ...stats,
    loading,
    error,
  };
}
