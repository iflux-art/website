import { Home, Globe, type LucideIcon } from "lucide-react";

/**
 * 基础导航项接口
 */
interface BaseNavItem {
  /** 导航项唯一标识 */
  key: string;
  /** 显示名称 */
  label: string;
  /** 描述文本 */
  description: string;
  /** 是否在特定场景下隐藏 */
  hidden?: boolean;
}

export const NAV_ITEMS = [
  {
    key: "blog",
    label: "博客",
    description: "阅读最新的博客文章，了解行业动态和技术趋势",
  },
  {
    key: "docs",
    label: "文档",
    description: "查看详细的文档和指南，了解如何使用我们的产品和服务",
  },
  {
    key: "links",
    label: "导航",
    description: "发现精选的网站和工具，提高您的工作效率",
  },
] as const satisfies readonly BaseNavItem[];

export const ADMIN_MENU_ITEMS = [
  {
    key: "admin",
    label: "仪表板",
    description: "查看系统概览和统计信息",
    icon: Home,
    permission: "admin.dashboard.view",
  },
  {
    key: "admin/links",
    label: "网址管理",
    description: "管理网站导航中的所有网址",
    icon: Globe,
    permission: "admin.links.manage",
  },
] as const satisfies Array<
  BaseNavItem & {
    icon: LucideIcon;
    permission?: string;
  }
>;

export const NAV_PATHS: Record<(typeof NAV_ITEMS)[number]["key"], string> = {
  blog: "/blog",
  docs: "/docs",
  links: "/links",
} as const;

/**
 * 检查导航配置完整性
 */
if (process.env.NODE_ENV === "development") {
  const navKeys = NAV_ITEMS.map((item) => item.key);
  const pathKeys = Object.keys(NAV_PATHS);

  // 确保所有配置项的key一致
  const allKeysMatch = navKeys.every((key) => pathKeys.includes(key));

  if (!allKeysMatch) {
    console.warn("Navigation configuration mismatch detected!");
    console.warn("NAV_ITEMS keys:", navKeys);
    console.warn("NAV_PATHS keys:", pathKeys);
  }
}

export const NAV_DESCRIPTIONS = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.key, item.description]),
) as Record<string, string>;
