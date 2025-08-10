/**
 * 通用工具函数和类型导出
 * 保留通用的工具函数，业务相关的已移动到对应的features目录
 */

// 通用类型导出
export type {
  BaseContent,
  BaseFrontmatter,
  BaseCategory,
} from "@/types/data-types";

export type {
  URL,
  BreadcrumbItem,
  BaseComponentProps,
  ClickableProps,
  FormComponentProps,
} from "@/types/base-types";

// 业务类型重新导出（保持向后兼容）
export type { BlogPost, TagCount, RelatedPost } from "@/features/blog/types";

export type {
  DocItem,
  DocCategory,
  DocListItem,
  SidebarItem,
  NavDocItem,
  Heading,
} from "@/features/docs/types";

export type {
  LinksItem,
  LinksCategory,
  LinksSubCategory,
  LinksFormData,
  CategoryId,
} from "@/features/links/types";

export type {
  BaseNavItem,
  NestedNavItem,
  BaseSearchResult,
  SearchResult,
} from "@/features/navigation/types";

// 通用工具函数导出
export {
  generateMetadata,
  generateArticleMetadata,
  generateProfileMetadata,
  generateViewport,
} from "@/lib/metadata";
