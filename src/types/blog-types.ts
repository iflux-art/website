/**
 * 博客相关类型定义
 */

import { BaseContent, BaseCategory } from "./data-types";
import { URL } from "./base-types";

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

/**
 * 博客分类
 */
export interface BlogCategory extends BaseCategory {
  /** 分类颜色 */
  color?: string;
  /** 分类图标 */
  icon?: string;
}

/**
 * 相关文章
 */
export interface RelatedPost
  extends Pick<
    BlogPost,
    "slug" | "title" | "description" | "excerpt" | "date" | "category"
  > {
  /** 相关度评分 */
  relevanceScore?: number;
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
