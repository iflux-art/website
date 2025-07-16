/**
 * 日志相关类型定义
 */

import {
  BaseContent,
  BaseFrontmatter,
  LoadingState,
} from "packages/src/types/data-types";
import { URL, ID } from "packages/src/types/base-types";

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
export interface JournalEntry extends BaseContent {
  /** 唯一标识 */
  id: ID;
  /** 内容类型 */
  type: "blog" | "doc" | "note" | "idea";
  /** 访问链接 */
  url: URL;
  /** 心情标签 */
  mood?: string;
  /** 天气 */
  weather?: string;
  /** 位置 */
  location?: string;
}

/** 日志状态 */
export interface JournalState extends LoadingState {
  /** 日志条目列表 */
  entries: JournalEntry[];
}
