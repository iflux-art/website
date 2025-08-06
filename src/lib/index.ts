/**
 * 业务逻辑库统一导出
 * 整合所有业务相关的工具函数和类型
 */

// ==================== 内容处理 ====================
export * from "@/lib/content";

// ==================== 全局文档结构 ====================
export * from "@/lib/global-docs";

// ==================== 元数据生成 ====================
export * from "@/lib/metadata";

// ==================== 重新导出常用类型 ====================
export type {
  BreadcrumbItem,
  BaseComponentProps,
  ClickableProps,
  FormComponentProps,
} from "@/types/base-types";

export type { BlogPost, TagCount, RelatedPost } from "@/types/blog-types";

export type {
  DocCategory,
  DocItem,
  SidebarItem,
  NavDocItem,
  Heading,
} from "@/types/docs-types";

export type {
  LinksItem,
  LinksCategory,
  LinksFormData,
  CategoryId,
} from "@/types/links-types";

export type {
  LoadingState,
  AsyncResult,
  PaginationInfo,
  PaginatedData,
} from "@/types/api-types";
