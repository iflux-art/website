/**
 * 文档类型定义 - 优化合并版
 */

import type { Heading } from "@/features/navbar/types";

// ================= 文档内容相关类型 =================
// 注意：Heading 类型已移动到 @/features/content/types

/** 文档分类 */
export interface DocCategory {
  /** 分类 ID */
  id: string;
  /** 分类名称 */
  name: string;
  /** 分类标题 */
  title: string;
  /** 分类 slug */
  slug: string;
  /** 分类描述 */
  description?: string;
  /** 文档数量 */
  count?: number;
  /** 分类排序 */
  order?: number;
  /** 分类图标 */
  icon?: string;
}

export interface DocContentBase {
  /** 文档标题 */
  title: string;
  /** 文档路径 */
  path?: string;
  /** 文档描述 */
  description?: string;
  /** 文档分类 */
  category?: string;
  /** 是否为索引页 */
  isIndex?: boolean;
}

export interface DocFrontmatter extends DocContentBase {
  date?: string;
  update?: string;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * 将任意对象安全地转换为 DocFrontmatter 类型
 * @param obj 要转换的对象
 * @returns 转换后的 DocFrontmatter 对象
 */
export function toDocFrontmatter<T extends Record<string, unknown>>(obj: T): DocFrontmatter {
  return {
    ...obj,
    title: (obj.title as string) ?? "",
  } as DocFrontmatter;
}

export interface DocItem extends DocContentBase {
  /** 文档内容 */
  content: string;
  /** 文档元数据 */
  frontmatter: DocFrontmatter;
  /** 文档标题 */
  headings: Heading[];
  /** 文档深度 */
  depth?: number;
  /** 文档 slug */
  slug?: string;
  /** 文档日期 */
  date?: string | null;
}

export interface DocTreeNode extends DocContentBase {
  children?: DocTreeNode[];
}

// ================= 文档导航相关类型 =================
export interface DocNavBase {
  title: string;
  path: string;
}

export interface SidebarItem extends DocNavBase {
  items?: SidebarItem[];
  collapsed?: boolean;
  type?: "separator" | "page" | "menu";
  isExternal?: boolean;
  href?: string;
  filePath?: string;
}

export interface NavDocItem extends DocNavBase {
  isNext?: boolean;
  [key: string]: unknown;
}

// ================= 保留原有类型别名以保持兼容 =================

export type DocListItem = Pick<DocItem, "title" | "description" | "path" | "category"> & {
  slug?: string;
  date?: string | null;
  isActive?: boolean;
  isParent?: boolean;
};

export type DocContentResult = DocItem & {
  prevDoc: NavDocItem | null;
  nextDoc: NavDocItem | null;
  breadcrumbs: unknown[];
  mdxContent: React.ReactNode;
  wordCount: number;
  date: string | null;
  update?: string | null;
  relativePathFromTopCategory: string;
  topLevelCategorySlug: string;
  isIndexPage: boolean;
};

// ================= 文档搜索相关类型 =================

/** 文档搜索结果 */
export interface DocSearchResult {
  /** 文档标题 */
  title: string;
  /** 文档路径 */
  path: string;
  /** 文档摘要 */
  excerpt: string;
}

/** 文档搜索参数 */
export interface DocSearchParams {
  /** 搜索查询 */
  query: string;
  /** 搜索限制 */
  limit?: number;
}
