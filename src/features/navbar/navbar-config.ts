import type { BaseNavItem } from "./navbar-types";

// 导航项配置
export const NAV_ITEMS: BaseNavItem[] = [
  {
    key: "blog",
    label: "博客",
    href: "https://blog.iflux.art/",
    external: true,
  },
  {
    key: "docs",
    label: "文档",
    href: "https://docs.iflux.art/",
    external: true,
  },
  {
    key: "hub",
    label: "导航",
    href: "https://hub.iflux.art/",
    external: true,
  },
  {
    key: "friends",
    label: "友链",
    href: "https://blog.iflux.art/friends/",
    external: true,
  },
];

// 导航路径映射
export const NAV_PATHS: Record<string, string> = {
  blog: "https://blog.iflux.art/",
  docs: "https://docs.iflux.art/",
  hub: "https://hub.iflux.art/",
  friends: "https://blog.iflux.art/friends/",
};

// 导航描述信息
export const NAV_DESCRIPTIONS: Record<string, string> = {
  blog: "查看最新博客文章",
  docs: "查阅技术文档和指南",
  hub: "查看网站导航",
  friends: "查看友情链接",
};
