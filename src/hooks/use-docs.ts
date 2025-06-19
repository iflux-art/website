/**
 * 文档相关钩子函数
 * @module hooks/use-docs
 */

'use client';

import { useContentData } from '@/hooks/use-content-data';
import { API_PATHS, HookResult } from '../utils/constants';
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
export function useDocCategories(): HookResult<DocCategory[]> {
  return useContentData<DocCategory[]>({
    type: 'docs',
    path: API_PATHS.DOCS.CATEGORIES,
  });
}

/**
 * 使用分类文档
 *
 * @param category 分类名称
 * @returns 分类下的文档列表
 */
export function useCategoryDocs(category: string): HookResult<DocListItem[]> {
  return useContentData<DocListItem[]>({
    type: 'docs',
    path: API_PATHS.DOCS.CATEGORY(category),
  });
}

/**
 * 使用文档元数据
 *
 * @param category 分类名称
 * @returns 文档元数据
 */
export function useDocMeta(path: string): HookResult<DocMeta> {
  return useContentData<DocMeta>({
    type: 'docs',
    path: API_PATHS.DOCS.META(path),
  });
}

/**
 * 使用文档侧边栏结构
 * @param category 分类名称
 * @returns 侧边栏结构和加载状态
 */
export function useDocSidebar(category: string): UseDocSidebarResult {
  const { data, loading, refresh, error } = useContentData<SidebarItem[]>({
    type: 'docs',
    path: API_PATHS.DOCS.SIDEBAR(category),
    disableCache: true,
  });

  return {
    items: data || [],
    loading,
    error: error?.message || null,
    refetch: async () => {
      await refresh();
    },
  };
}

// 导出类型
export type { DocItem, DocCategory, DocMeta, DocListItem, UseDocSidebarResult, SidebarItem };

/**
 * 获取所有文档
 * @returns 所有文档列表
 */
/**
 * 使用文档内容
 *
 * @param path 文档路径
 * @returns 文档内容和刷新方法
 */
export function useDocContent(path: string): HookResult<DocItem> {
  return useContentData<DocItem>({
    type: 'docs',
    path: API_PATHS.DOCS.CONTENT(path),
  });
}
