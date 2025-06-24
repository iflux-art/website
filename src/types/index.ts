/**
 * 类型定义统一导出文件
 * 所有类型的单一入口点
 */

// ==================== 基础通用类型 ====================
export type {
  // 基础值类型
  ID,
  Timestamp,
  URL,
  Color,

  // 基础组件类型
  BaseComponentProps,
  ClickableProps,
  FormComponentProps,

  // 数据状态类型
  LoadingState,
  AsyncResult,
  PaginationInfo,
  PaginatedData,

  // 内容基础类型
  BaseFrontmatter,
  BaseContent,
  BaseCategory,

  // API 相关类型
  ApiResponse,
  ApiError,

  // 配置相关类型
  CacheConfig,
  ThemeConfig,

  // 导航相关类型
  BaseNavItem,
  NestedNavItem,

  // 搜索相关类型
  BaseSearchResult,

  // 工具函数类型
  DeepReadonly,
  Optional,
  RequiredFields,
  NonNullable,
} from './common';

// ==================== MDX 相关类型 ====================
export type {
  // MDX 特定类型
  CustomComponentProps,
  MDXFrontmatter,
  MDXContent,
  MDXRendererProps,
  MDXOptions,
  MDXComponents,

  // MDX 组件类型
  MDXImageProps,
  MDXLinkProps,
  CodeBlockProps,
  ListType,
  ListIconType,
  MDXListStyleProps,
  MDXListProps,
  MDXListItemProps,
  MDXStyleConfig,

  // 类型保护函数在各自模块中导出
} from './mdx-types';

// ==================== 博客相关类型 ====================
export type { BlogPost, BlogCategory, RelatedPost, TagCount } from './blog-types';

// ==================== 文档相关类型 ====================
export type {
  DocMetaItem,
  Heading,
  DocCategory,
  DocItem,
  DocListItem,
  DocTreeNode,
  DocNavItem,
  SidebarItem,
  UseDocSidebarResult,
} from './docs-types';

// ==================== 日志相关类型 ====================
export type { JournalFrontmatter, MDXEntry, JournalEntry, JournalState } from './journal-types';

// ==================== 导航相关类型 ====================
export type {
  LinksItem,
  LinksCategory,
  LinksData,
  WebsiteMetadata,
  LinksFormData,
  Link,
  Subcategory,
} from './links-types';

// ==================== 导航链接类型 ====================
export type { NavLinkProps } from './nav-types';

// ==================== 搜索相关类型 ====================
export type {
  SearchDialogProps,
  SearchResult,
  Command,
  SearchDialogContentProps,
  SearchHistoryProps,
  APISearchResult,
} from './search-types';

// ==================== 工具相关类型 ====================
export type { ToolState, ToolActions, ToolConfig } from './tools-types';

// ==================== Hooks 相关类型 ====================
export type { ContentOptions, ContentData } from './hooks';

// ==================== Hooks 内部类型 ====================
export type {
  UseScrollOptions,
  ScrollHandler,
  ThrottledScrollHandler,
  UseNavbarScrollOptions,
} from './hooks-internal';

// ==================== 全局类型声明 ====================
// 全局类型声明在 global.d.ts 中定义

// ==================== 类型别名和联合类型 ====================

/** 所有内容类型的联合 */
export type ContentType = 'blog' | 'docs' | 'journal' | 'tools' | 'links';

/** 所有分类类型的联合 */
export type CategoryType =
  | import('./blog-types').BlogCategory
  | import('./docs-types').DocCategory
  | import('./links-types').LinksCategory;

/** 所有内容项类型的联合 */
export type ContentItem =
  | import('./blog-types').BlogPost
  | import('./docs-types').DocItem
  | import('./journal-types').JournalEntry
  | import('./links-types').LinksItem;

/** 所有 Frontmatter 类型的联合 */
export type AnyFrontmatter =
  | import('./common').BaseFrontmatter
  | import('./mdx-types').MDXFrontmatter
  | import('./journal-types').JournalFrontmatter;

/** 主题模式 */
export type ThemeMode = 'light' | 'dark' | 'system';

/** 响应式断点 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** 状态类型 */
export type Status = 'idle' | 'loading' | 'success' | 'error';

/** 排序方向 */
export type SortDirection = 'asc' | 'desc';

/** 排序字段 */
export type SortField = 'title' | 'date' | 'category' | 'tags' | 'author';

// ==================== 常用类型组合 ====================

/** 带分页的内容列表 */
export type PaginatedContent<T extends ContentItem> = import('./common').PaginatedData<T>;

/** 带加载状态的数据 */
export type LoadingData<T> = import('./common').AsyncResult<T>;

/** 搜索结果集合 */
export type SearchResults = {
  docs: import('./search-types').SearchResult[];
  blogs: import('./search-types').SearchResult[];
  tools: import('./search-types').SearchResult[];
  links: import('./search-types').SearchResult[];
  total: number;
};

/** 导航菜单项 */
export type MenuItem = import('./common').NestedNavItem & {
  badge?: string;
  shortcut?: string;
};

// ==================== 类型保护函数 ====================

/** 检查是否为博客文章 */
export const isBlogPost = (item: ContentItem): item is import('./blog-types').BlogPost => {
  return 'excerpt' in item && 'author' in item;
};

/** 检查是否为文档项 */
export const isDocItem = (item: ContentItem): item is import('./docs-types').DocItem => {
  return 'path' in item && 'category' in item;
};

/** 检查是否为日志条目 */
export const isJournalEntry = (
  item: ContentItem
): item is import('./journal-types').JournalEntry => {
  return 'type' in item && 'url' in item;
};

/** 检查是否为链接项 */
export const isLinksItem = (item: ContentItem): item is import('./links-types').LinksItem => {
  return 'url' in item && 'iconType' in item;
};

// ==================== 默认导出 ====================

// 从 mdx-types 导入类型保护函数
export { isMDXContent } from './mdx-types';

/** 类型工具集合 */
export const TypeUtils = {
  isBlogPost,
  isDocItem,
  isJournalEntry,
  isLinksItem,
} as const;
