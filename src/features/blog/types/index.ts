/**
 * 博客相关类型定义
 */

import type { BaseContent, URL } from '@/types';

/**
 * 博客文章
 */
export interface BlogPost extends BaseContent {
  /** 作者 */
  author?: string;
  /** 作者头像 */
  authorAvatar?: URL | null;
  /** 作者简介 */
  authorBio?: string;
  /** 是否已发布 */
  published?: boolean;
  /** 文章摘要 */
  excerpt: string;
  /** 是否为特色文章 */
  featured?: boolean;
  /** 文章封面图片 */
  image?: URL;
  /** 阅读时间（分钟） */
  readingTime?: number;
  /** 浏览次数 */
  views?: number;
  /** 点赞数 */
  likes?: number;
}

export interface RelatedPost {
  title: string;
  href: string;
  category?: string;
}

/**
 * 标签统计
 */
export interface TagCount {
  /** 标签名称 */
  tag: string;
  /** 文章数量 */
  count: number;
  /** 标签颜色 */
  color?: string;
}

/**
 * 分类统计
 */
export interface CategoryWithCount {
  /** 分类名称 */
  name: string;
  /** 文章数量 */
  count: number;
}

/**
 * 博客文章Frontmatter
 */
export interface BlogFrontmatter {
  title: string;
  description?: string;
  date?: string | Date;
  update?: string | Date;
  category?: string;
  tags?: string[];
  published?: boolean;
  excerpt?: string;
  cover?: string;
}
