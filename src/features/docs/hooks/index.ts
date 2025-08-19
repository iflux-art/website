/**
 * 文档相关钩子函数
 * @module hooks/use-docs
 */

'use client';

import { useContentData } from '@/hooks/use-content-data';
import { API_PATHS } from '@/config/metadata';
import type { DocItem, DocCategory, DocListItem } from '@/features/docs/types';
import type { HookResult } from '@/hooks/use-content-data';

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
 * 使用文档元数据
 *
 * @param category 分类名称
 * @returns 文档元数据
 */
export function useDocMeta(path: string): HookResult<Record<string, unknown>> {
  return useContentData<Record<string, unknown>>({
    type: 'docs',
    path: API_PATHS.DOCS.META(path),
  });
}

// 导出类型
export type { DocItem, DocCategory, DocListItem };

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
