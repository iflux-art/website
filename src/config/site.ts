/**
 * 站点基础配置
 */

// 站点元数据类型
interface SiteMetadata {
  title: string;
  description: string;
  author: string;
  url: string;
  image: string;
  keywords: string[];
  twitter: string;
  github: string;
  email: string;
  copyright: string;
}

/**
 * 网站元数据
 */
export const SITE_METADATA: SiteMetadata = {
  // 基本信息
  title: "iFluxArt · 斐流艺创",
  description: "斐启智境 · 流韵新生",
  author: "iFluxArt Team",

  // SEO 相关
  url: "https://iflux.art",
  image: "/images/og-image.png",
  keywords: ["iFluxArt", "斐流艺创", "人工智能", "AI", "艺术创作", "数字艺术"],

  // 社交媒体
  twitter: "@ifluxart",
  github: "iflux-art",

  // 联系方式
  email: "hello@iflux.art",

  // 版权信息
  copyright: `© ${new Date().getFullYear()} iFluxArt · 斐流艺创`,
};

/**
 * 通用缓存配置
 */
export const CACHE_CONFIG = {
  /** 默认缓存时间（5分钟） */
  DEFAULT_CACHE_TIME: 5 * 60 * 1000,

  /** 长缓存时间（1小时） */
  LONG_CACHE_TIME: 60 * 60 * 1000,

  /** 短缓存时间（1分钟） */
  SHORT_CACHE_TIME: 60 * 1000,
} as const;

/**
 * API路径配置
 */
export const API_PATHS = {
  BLOG: {
    POSTS: "/api/blog/posts",
    TAGS_COUNT: "/api/blog/tags/count",
    CATEGORIES: "/api/blog/categories",
    TIMELINE: "/api/blog/timeline",
  },
  DOCS: {
    CATEGORIES: "/api/docs/categories",
    CATEGORY: (category: string) =>
      `/api/docs/categories/${encodeURIComponent(category)}`,
    META: (path: string) => `/api/docs/${encodeURIComponent(path)}/meta`,
    SIDEBAR: (category: string) =>
      `/api/docs/sidebar/${encodeURIComponent(category)}`,
    CONTENT: (path: string) => `/api/docs/${encodeURIComponent(path)}`,
  },
} as const;
