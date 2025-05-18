/**
 * 全局常量配置文件
 * 集中管理应用中使用的常量，便于维护和复用
 */

// 支持的语言列表
export const SUPPORTED_LANGUAGES = [
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

// 导航菜单项配置
export const NAV_ITEMS = [
  { key: "docs", labelKey: "nav.docs" },
  { key: "blog", labelKey: "nav.blog" },
  { key: "navigation", labelKey: "nav.navigation" },
  { key: "friends", labelKey: "nav.friends" },
];

// 搜索分类
export const SEARCH_CATEGORIES = [
  { id: "pages", labelKey: "search.category.pages" },
  { id: "docs", labelKey: "search.category.docs" },
  { id: "blog", labelKey: "search.category.blog" },
  { id: "navigation", labelKey: "search.category.navigation" },
];

// 模拟的搜索数据
export const SEARCH_ITEMS = [
  { id: 1, title: "首页", titleEn: "Home", category: "pages", url: "/" },
  { id: 2, title: "文档介绍", titleEn: "Documentation", category: "docs", url: "/docs" },
  { id: 3, title: "快速开始", titleEn: "Getting Started", category: "docs", url: "/docs/getting-started" },
  { id: 4, title: "组件库", titleEn: "Components", category: "docs", url: "/docs/components" },
  { id: 5, title: "最新博客", titleEn: "Latest Blog", category: "blog", url: "/blog" },
  { id: 6, title: "React 最佳实践", titleEn: "React Best Practices", category: "blog", url: "/blog/react-best-practices" },
  { id: 7, title: "Next.js 入门指南", titleEn: "Next.js Guide", category: "blog", url: "/blog/nextjs-guide" },
  { id: 8, title: "友情链接", titleEn: "Friends", category: "navigation", url: "/friends" },
];

// 网站元数据
export const SITE_METADATA = {
  title: {
    zh: "iFluxArt · 斐流艺创",
    en: "iFluxArt · Creative Flow",
  },
  description: {
    zh: "斐启智境 · 流韵新生",
    en: "Brilliant Minds · Flowing Creativity",
  },
  author: "iFluxArt Team",
};