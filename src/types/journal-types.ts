/**
 * 日志相关类型定义
 */

import { BaseFrontmatter, LoadingState } from "@/types/data-types";

/** 日志 Frontmatter */
export interface JournalFrontmatter extends BaseFrontmatter {
  /** 内容类型 */
  type?: "blog" | "doc" | "note" | "idea";
  /** 心情标签 */
  mood?: "happy" | "sad" | "excited" | "calm" | "frustrated" | "inspired";
  /** 天气 */
  weather?: string;
  /** 位置 */
  location?: string;
}

/** MDX 条目 */
export interface MDXEntry {
  /** Frontmatter 数据 */
  frontmatter: JournalFrontmatter;
  /** URL 路径 */
  slug: string;
  /** 内容 */
  content: string;
}

/** 日志条目 */
export interface JournalEntry extends MDXEntry {
  /** 唯一标识 */
  id: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 内容类型 */
  type: "blog" | "doc" | "note" | "idea";
  /** URL 路径 */
  url: string;
  /** 日期 */
  date: string;
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
}

/** 日志状态 */
export interface JournalState extends LoadingState {
  /** 日志条目列表 */
  entries: JournalEntry[];
}
