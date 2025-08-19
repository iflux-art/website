/**
 * 内容基础类型定义
 *
 * 包含内容、分类等基础类型，为整个应用的内容管理提供统一的类型定义。
 * 这些类型被多个功能模块共享使用，确保数据结构的一致性。
 *
 * 主要类型：
 * - BaseFrontmatter: 文档前置元数据
 * - BaseContent: 基础内容接口
 * - BaseCategory: 基础分类接口
 *
 * @author 系统重构
 * @since 2024
 */

import type { URL } from '@/types';

/** 基础 Frontmatter 类型 */
export interface BaseFrontmatter {
  /** 标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 发布日期 */
  date?: string | Date;
  /** 标签列表 */
  tags?: string[];
  /** 是否为草稿 */
  draft?: boolean;
  /** 分类 */
  category?: string;
  /** 作者 */
  author?: string;
  /** 封面图片 */
  image?: URL;
  /** URL 路径 */
  slug?: string;
  /** 最后修改时间 */
  lastModified?: string | Date;
  /** 字数统计 */
  wordCount?: number;
  /** SEO 相关数据 */
  seo?: Record<string, unknown>;
}

/** 基础内容接口 */
export interface BaseContent {
  /** 唯一标识（URL路径） */
  slug: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 标签列表 */
  tags?: string[];
  /** 发布日期 */
  date?: string | Date;
  /** 分类 */
  category?: string;
}

/** 基础分类接口 */
export interface BaseCategory {
  /** 分类唯一标识 */
  id: string;
  /** 分类标题 */
  title: string;
  /** 分类描述 */
  description: string;
  /** 分类下的内容数量 */
  count?: number;
  /** 排序权重 */
  order?: number;
}
