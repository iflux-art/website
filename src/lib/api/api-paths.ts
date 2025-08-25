/**
 * API 路径常量
 * 定义所有API端点的路径常量，便于统一管理和维护
 */

// 内容API路径
export const CONTENT_API_PATHS = {
  // 博客相关
  BLOG_POSTS: '/api/blog/posts',
  BLOG_POST: (slug: string) => `/api/blog/posts/${slug}`,
  BLOG_CATEGORIES: '/api/blog/categories',
  BLOG_TAGS: '/api/blog/tags',

  // 文档相关
  DOCS: '/api/docs',
  DOC: (slug: string) => `/api/docs/${slug}`,
  DOC_CATEGORIES: '/api/docs/categories',

  // 链接相关
  LINKS: '/api/links',
  LINK: (id: string) => `/api/links/${id}`,
  LINK_CATEGORIES: '/api/links/categories',
} as const;

// 博客API路径
export const BLOG_API_PATHS = {
  POSTS: '/api/blog/posts',
  TAGS_COUNT: '/api/blog/tags',
  TIMELINE: '/api/blog/timeline',
} as const;

// 用户API路径
export const USER_API_PATHS = {
  PROFILE: '/api/user/profile',
  SETTINGS: '/api/user/settings',
  PREFERENCES: '/api/user/preferences',
} as const;

// 搜索API路径
export const SEARCH_API_PATHS = {
  SEARCH: '/api/search',
  SEARCH_SUGGESTIONS: '/api/search/suggestions',
} as const;

// 分析API路径
export const ANALYTICS_API_PATHS = {
  PAGE_VIEWS: '/api/analytics/page-views',
  USER_ACTIVITY: '/api/analytics/user-activity',
} as const;

// 通知API路径
export const NOTIFICATION_API_PATHS = {
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATION: (id: string) => `/api/notifications/${id}`,
  MARK_AS_READ: '/api/notifications/mark-as-read',
} as const;

// 导出API_PATHS以保持向后兼容性
export const API_PATHS = {
  BLOG: BLOG_API_PATHS,
  CONTENT: CONTENT_API_PATHS,
  USER: USER_API_PATHS,
  SEARCH: SEARCH_API_PATHS,
  ANALYTICS: ANALYTICS_API_PATHS,
  NOTIFICATION: NOTIFICATION_API_PATHS,
  DOCS: CONTENT_API_PATHS, // 为文档API提供别名以保持向后兼容性
} as const;
