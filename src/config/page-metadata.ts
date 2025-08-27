/**
 * 页面元数据配置
 *
 * 集中管理各个页面的元数据配置，便于统一维护和更新
 */

import type { Metadata } from "next";

/**
 * 首页元数据配置
 */
export const HOME_PAGE_METADATA: Metadata = {
  title: "首页",
  description: "iFluxArt · 斐流艺创 - 智能技术与艺术创作的有机融合",
  openGraph: {
    title: "iFluxArt · 斐流艺创",
    description: "智能技术与艺术创作的有机融合",
    type: "website",
  },
};

/**
 * 链接页面元数据配置
 */
export const LINKS_PAGE_METADATA: Metadata = {
  title: "网址导航",
  description: "收集整理各类优质网站资源，方便快速访问",
  openGraph: {
    title: "网址导航",
    description: "收集整理各类优质网站资源，方便快速访问",
    type: "website",
  },
};

/**
 * 关于页面元数据配置
 */
export const ABOUT_PAGE_METADATA: Metadata = {
  title: "关于我",
  description: "个人介绍和联系方式",
  openGraph: {
    title: "关于我",
    description: "个人介绍和联系方式",
    type: "profile",
  },
};

/**
 * 友情链接页面元数据配置
 */
export const FRIENDS_PAGE_METADATA: Metadata = {
  title: "友情链接",
  description: "友情链接列表和申请方式",
  keywords: "友链,网站,合作",
  openGraph: {
    title: "友情链接",
    description: "友情链接列表和申请方式",
    type: "website",
  },
};

/**
 * 文档页面元数据配置
 */
export const DOCS_PAGE_METADATA: Metadata = {
  title: "文档",
  description: "项目文档和使用指南",
  openGraph: {
    title: "文档",
    description: "项目文档和使用指南",
    type: "website",
  },
};

/**
 * 博客页面元数据配置
 */
export const BLOG_PAGE_METADATA: Metadata = {
  title: "博客",
  description: "技术分享和创作心得",
  openGraph: {
    title: "博客",
    description: "技术分享和创作心得",
    type: "website",
  },
};

/**
 * 个人资料页面元数据配置
 */
export const PROFILE_PAGE_METADATA: Metadata = {
  title: "个人资料",
  description: "用户个人资料和账户信息",
  openGraph: {
    title: "个人资料",
    description: "用户个人资料和账户信息",
    type: "profile",
  },
};

/**
 * 页面元数据配置映射
 */
export const PAGE_METADATA_MAP = {
  home: HOME_PAGE_METADATA,
  links: LINKS_PAGE_METADATA,
  about: ABOUT_PAGE_METADATA,
  friends: FRIENDS_PAGE_METADATA,
  docs: DOCS_PAGE_METADATA,
  blog: BLOG_PAGE_METADATA,
  profile: PROFILE_PAGE_METADATA,
};
