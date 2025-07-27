/**
 * 文档类型定义 - 优化合并版
 */

// ================= 文档内容相关类型 =================
export interface Heading {
  level: number;
  text: string;
  id: string;
}

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
  tags?: string[];
  [key: string]: any;
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
  [key: string]: any;
}

// ================= 文档组件属性类型 =================
export interface DocsContentProps {
  doc: DocItem;
}

// ================= 保留原有类型别名以保持兼容 =================
export type DocMetaItem = DocContentBase & {
  href?: URL;
  collapsed?: boolean;
  items?: string[] | Record<string, DocMetaItem | string>;
  type?: "separator" | "page" | "menu";
  display?: "hidden" | "normal";
  order?: number;
  index?: boolean;
  hidden?: boolean;
};

export type DocListItem = Pick<
  DocItem,
  "title" | "description" | "path" | "category"
> & {
  slug?: string;
  date?: string | null;
  isActive?: boolean;
  isParent?: boolean;
};

export type UseDocSidebarResult = {
  items: SidebarItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export type DocContentResult = DocItem & {
  prevDoc: NavDocItem | null;
  nextDoc: NavDocItem | null;
  breadcrumbs: any[];
  mdxContent: React.ReactNode;
  wordCount: number;
  date: string | null;
  relativePathFromTopCategory: string;
  topLevelCategorySlug: string;
  isIndexPage: boolean;
};
