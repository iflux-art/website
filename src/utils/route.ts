/**
 * 路由相关工具函数
 */

import { ContentType } from '@/components/common/content-display';
import { CONTENT_BASE_ROUTES } from '@/config/layout';

/**
 * 构建标签链接
 * @param tag 标签名
 * @param contentType 内容类型
 * @returns 完整的标签链接URL
 */
export function buildTagLink(tag: string, contentType: ContentType): string {
  const base = CONTENT_BASE_ROUTES[contentType];
  return `${base}?tag=${encodeURIComponent(tag)}`;
}

/**
 * 构建分类链接
 * @param category 分类名
 * @param contentType 内容类型
 * @returns 完整的分类链接URL
 */
export function buildCategoryLink(category: string, contentType: ContentType): string {
  const base = CONTENT_BASE_ROUTES[contentType];
  return `${base}?category=${encodeURIComponent(category)}`;
}
