/**
 * 博客相关类型定义
 */

import { BaseContent } from '../../../shared/types/base';

/**
 * 博客文章
 */
export interface BlogPost extends BaseContent {
  /** 作者 */
  author?: string;
  /** 作者头像 */
  authorAvatar?: string | null;
  /** 作者简介 */
  authorBio?: string;
  /** 是否已发布 */
  published?: boolean;
  /** 文章摘要 */
  excerpt: string;
  /** 分类 */
  category?: string;
}

/**
 * 相关文章
 */
export interface RelatedPost extends BaseContent {
  /** 文章摘要 */
  excerpt: string;
}

/**
 * 标签统计
 */
export interface TagCount {
  /** 标签名称 */
  tag: string;
  /** 文章数量 */
  count: number;
}
