/**
 * 统计数据相关钩子函数
 * @module hooks/use-site-stats
 */

'use client';

import { useMemo } from 'react';
import { useBlogPosts } from '@/features/blog/hooks';
import { useDocCategories } from '@/features/docs/hooks';
import { useLinksData } from '@/features/links/hooks';
import type { SiteStats } from '@/features/home/types';

/**
 * 获取网站统计数据
 * @returns 网站各模块的统计数据
 */
export function useSiteStats(): SiteStats {
  const { posts: blogPosts, loading: blogLoading, error: blogError } = useBlogPosts();
  const { data: docCategories, loading: docLoading, error: docError } = useDocCategories();
  const { allItems: linkItems, loading: linkLoading, error: linkError } = useLinksData();

  const stats = useMemo(() => {
    // 博客数量
    const blogCount = blogPosts?.length || 0;

    // 文档数量 - 计算所有分类下的文档总数
    const docCount =
      docCategories?.reduce((total, category) => {
        return total + (category.count ?? 0);
      }, 0) ?? 0;

    // 导航链接数量 - 排除友链和个人主页分类
    const linkCount =
      linkItems?.filter(item => item.category !== 'friends' && item.category !== 'profile')
        .length ?? 0;

    // 友链数量
    const friendCount = linkItems?.filter(item => item.category === 'friends').length ?? 0;

    return {
      blogCount,
      docCount,
      linkCount,
      friendCount,
    };
  }, [blogPosts, docCategories, linkItems]);

  const loading = blogLoading || docLoading || linkLoading;
  const error = blogError?.message ?? docError?.message ?? linkError ?? null;

  return {
    ...stats,
    loading,
    error,
  };
}
