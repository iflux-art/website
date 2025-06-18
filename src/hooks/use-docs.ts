/**
 * 文档相关钩子函数
 * @module hooks/use-docs
 */

'use client';

import { useCallback } from 'react';
import { useContentData } from '@/hooks/use-content-data';
import { useCache } from '@/hooks/use-cache';
import {
  DocItem,
  DocCategory,
  DocMeta,
  DocListItem,
  UseDocSidebarResult,
  SidebarItem,
} from '@/types/docs-types';

/**
 * 使用文档分类
 *
 * @returns 文档分类列表
 */
export function useDocCategories(): { categories: DocCategory[] } {
  const { data: categories } = useContentData<DocCategory[]>({
    type: 'docs',
    path: '/api/docs/categories',
  });
  return { categories: categories || [] };
}

/**
 * 使用分类文档
 *
 * @param category 分类名称
 * @returns 分类下的文档列表
 */
export function useCategoryDocs(category: string): { docs: DocListItem[] } {
  const { data: docs } = useContentData<DocListItem[]>({
    type: 'docs',
    path: `/api/docs/categories/${encodeURIComponent(category)}`,
  });
  return { docs: docs || [] };
}

/**
 * 使用文档元数据
 *
 * @param category 分类名称
 * @returns 文档元数据
 */
export function useDocMeta(category: string): { meta: DocMeta | null } {
  const { data: meta } = useContentData<DocMeta>({
    type: 'docs',
    path: `/api/docs/meta/${encodeURIComponent(category)}`,
  });
  return { meta: meta || null };
}

/**
 * 使用文档侧边栏结构
 * @param category 分类名称
 * @returns 侧边栏结构和加载状态
 */
export function useDocSidebar(category: string): UseDocSidebarResult {
  const fetchSidebarData = useCallback(async () => {
    const response = await fetch(`/api/docs/sidebar/${encodeURIComponent(category)}`, {
      headers: {
        'Cache-Control': 'max-age=1800, stale-while-revalidate=3600',
        Pragma: 'no-cache',
      },
      cache: 'no-store',
    });
    const data = await response.json();
    return data as SidebarItem[];
  }, [category]);

  const { data, loading, refetch } = useCache<SidebarItem[]>(
    `sidebar:${category}`,
    fetchSidebarData,
    {
      expiry: 30 * 60 * 1000,
      useMemoryCache: true,
    }
  );

  return {
    items: data || [],
    loading,
    refetch,
  };
}

/**
 * 获取所有文档
 * @returns 所有文档列表
 */
export async function getAllDocs(): Promise<DocItem[]> {
  const response = await fetch('/api/docs/all', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

/**
 * 使用文档侧边栏项目（兼容旧版本）
 * @param category 分类名称
 * @returns 侧边栏项目列表和加载状态
 * @deprecated 使用 useDocSidebar 代替
 */
export function useDocSidebarItems(category: string): UseDocSidebarResult {
  return useDocSidebar(category);
}
