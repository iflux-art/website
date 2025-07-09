/**
 * 网址导航数据类型定义
 */

import type { ComponentType } from "react";
import { BaseCategory, URL, ID, Timestamp } from "./common";

export type CategoryId =
  | "ai"
  | "development"
  | "design"
  | "audio"
  | "video"
  | "office"
  | "productivity"
  | "operation"
  | "profile"
  | "friends";

/** 导航链接项 */
export interface LinksItem {
  /** 唯一标识 */
  id: ID;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 链接地址 */
  url: URL;
  /** 图标 */
  icon?: string;
  /** 图标类型 */
  iconType?: "image" | "text";
  /** 标签列表 */
  tags: string[];
  /** 是否为特色链接 */
  featured?: boolean;
  /** 所属分类 */
  category: CategoryId;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
  /** 访问次数 */
  visits?: number;
  /** 是否可用 */
  isActive?: boolean;
}

/** 导航分类 */
export interface LinksCategory extends BaseCategory {
  /** 分类ID */
  id: CategoryId;
  /** 分类名称 */
  name: string;
  /** 分类描述 */
  description: string;
  /** 排序序号 */
  order: number;
  /** 分类图标 */
  icon?: string;
  /** 分类颜色 */
  color?: string;
}

export interface LinksData {
  categories: LinksCategory[];
  items: LinksItem[];
}

export interface WebsiteMetadata {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
}

export interface LinksFormData {
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType: "image" | "text";
  tags: string[];
  featured: boolean;
  category: string;
}

export interface Link {
  title: string;
  url: string;
  description: string;
  tags: string[];
  icon?: ComponentType<{ className?: string }>;
}

export interface Subcategory {
  title: string;
  links: Link[];
}
