/**
 * 内容相关公共类型定义
 *
 * 包含被博客和文档等多个功能模块共享使用的内容类型
 */

// ==================== 基础类型定义（原 src/types/content-types.ts 内容）====================

/** Url 类型 */
export type Url = string;

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

// ==================== 扩展类型定义 ====================

/** 内容项基础接口 */
export interface ContentItem extends BaseContent {
  /** 内容摘要 */
  excerpt?: string;
  /** 是否已发布 */
  published?: boolean;
  /** 封面图片 */
  cover?: Url;
  /** 阅读时间（分钟） */
  readingTime?: number;
  /** 浏览次数 */
  views?: number;
  /** 点赞数 */
  likes?: number;
  /** 更新时间 */
  update?: string | Date;
}

/** 内容分类接口 */
export interface ContentCategory extends BaseCategory {
  /** 分类图标 */
  icon?: string;
  /** 分类颜色 */
  color?: string;
}

/** 内容搜索结果基础接口 */
export interface ContentSearchResult {
  /** 标题 */
  title: string;
  /** 路径 */
  path: string;
  /** 摘要 */
  excerpt: string;
  /** 类型 */
  type: "blog" | "doc" | "page";
}

/** 内容搜索参数 */
export interface ContentSearchParams {
  /** 搜索查询 */
  query: string;
  /** 搜索限制 */
  limit?: number;
  /** 搜索类型 */
  type?: "blog" | "doc" | "all";
}

/** 内容统计信息 */
export interface ContentStats {
  /** 总文章数 */
  total: number;
  /** 分类统计 */
  categories: Record<string, number>;
  /** 标签统计 */
  tags: Record<string, number>;
}

/** 内容页面状态 */
export interface ContentPageState {
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  limit: number;
  /** 搜索关键词 */
  search?: string;
  /** 分类筛选 */
  category?: string;
  /** 标签筛选 */
  tag?: string;
  /** 排序方式 */
  sort?: "date" | "views" | "likes";
  /** 排序方向 */
  order?: "asc" | "desc";
}
