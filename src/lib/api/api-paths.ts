/**
 * API 路径常量
 * 定义所有API端点的路径常量，便于统一管理和维护
 */

// 内容API路径
export const CONTENT_API_PATHS = {
  // 博客相关
  BlogPosts: "/api/blog/posts",
  BlogPost: (slug: string) => `/api/blog/posts/${slug}`,
  BlogCategories: "/api/blog/categories",
  BlogTags: "/api/blog/tags",

  // 文档相关
  Docs: "/api/docs",
  Doc: (slug: string) => `/api/docs/${slug}`,
  DocCategories: "/api/docs/categories",

  // 链接相关
  Links: "/api/links",
  Link: (id: string) => `/api/links/${id}`,
  LinkCategories: "/api/links/categories",
} as const;

// 博客API路径
export const BLOG_API_PATHS = {
  Posts: "/api/blog/posts",
  TagsCount: "/api/blog/tags",
  Timeline: "/api/blog/timeline",
} as const;

// 用户API路径
export const USER_API_PATHS = {
  Profile: "/api/user/profile",
  Settings: "/api/user/settings",
  Preferences: "/api/user/preferences",
} as const;

// 搜索API路径
export const SEARCH_API_PATHS = {
  Search: "/api/search",
  SearchSuggestions: "/api/search/suggestions",
} as const;

// 分析API路径
export const ANALYTICS_API_PATHS = {
  PageViews: "/api/analytics/page-views",
  UserActivity: "/api/analytics/user-activity",
} as const;

// 通知API路径
export const NOTIFICATION_API_PATHS = {
  Notifications: "/api/notifications",
  Notification: (id: string) => `/api/notifications/${id}`,
  MarkAsRead: "/api/notifications/mark-as-read",
} as const;

// 导出API_PATHS以保持向后兼容性
export const API_PATHS = {
  blog: BLOG_API_PATHS,
  content: CONTENT_API_PATHS,
  user: USER_API_PATHS,
  search: SEARCH_API_PATHS,
  analytics: ANALYTICS_API_PATHS,
  notification: NOTIFICATION_API_PATHS,
  docs: CONTENT_API_PATHS, // 为文档API提供别名以保持向后兼容性
} as const;
