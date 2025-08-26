/**
 * 文档相关钩子函数
 * @module hooks/use-docs
 */

"use client";

import type { DocCategory, DocItem, DocListItem } from "@/features/docs/types";
import { API_PATHS } from "@/lib/api/api-paths";
import { type HookResult, useContentData } from "../../../hooks/use-content-data";

/**
 * 使用文档分类
 *
 * @returns 文档分类列表
 */
export function useDocCategories(): HookResult<DocCategory[]> {
  return useContentData<DocCategory[]>({
    type: "docs",
    path: API_PATHS.content.DocCategories,
    disableCache: true, // 禁用缓存，确保获取最新数据
    params: { cache: "no-store" }, // 添加参数帮助禁用服务器缓存
    forceRefresh: true, // 强制刷新，缓存破坏
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
    type: "docs",
    path: API_PATHS.content.Doc(path),
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
    type: "docs",
    path: API_PATHS.content.Doc(path),
  });
}
