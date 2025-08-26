/**
 * 类型定义统一导出
 * 集中管理所有全局类型定义，便于引用
 */

// 内容相关类型
export type { BaseFrontmatter, BaseContent, BaseCategory, Url as URL } from "./content-types";

// 布局相关类型
export type {
  PageLayoutType,
  PageContainerConfig,
  SidebarConfig,
  NotFoundProps,
  PageProps,
  PageLayoutProps,
  AppGridProps,
  PageContainerProps,
  ThreeColumnLayoutProps,
  ThreeColumnGridProps,
  SidebarWrapperProps,
  GridColsMap,
  GridGapMap,
} from "./layout-types";

// 导航相关类型
export type {
  BreadcrumbItem,
  Heading,
  SidebarItem,
  SidebarProps,
  BaseNavItem,
  NestedNavItem,
  BaseSearchResult,
  NavbarSearchResult,
} from "./nav-types";

// SEO相关类型
export type {
  IconConfig,
  VerificationConfig,
  JsonLdConfig,
  SocialConfig,
  GenerateMetadataOptions,
  SiteConfig,
  SEOPageOptions,
} from "./seo-types";
