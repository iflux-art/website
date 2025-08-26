import type { BaseNavItem } from "@/types";
import {
  BookOpen,
  Compass,
  FileText,
  Globe,
  Home,
  Info,
  Link,
  type LucideIcon,
} from "lucide-react";

/**
 * 导航配置项接口
 */
export interface NavConfigItem extends BaseNavItem {
  /** 描述文本 */
  description: string;
  /** 是否在特定场景下隐藏 */
  hidden?: boolean;
  /** 子菜单项 */
  children?: readonly NavConfigItem[];
  /** 图标 */
  icon?: LucideIcon;
}

export const NAV_ITEMS = [
  {
    key: "blog",
    label: "博客",
    description: "阅读最新的文章，了解行业动态和技术趋势",
    icon: BookOpen,
  },
  {
    key: "docs",
    label: "文档",
    description: "查看详细的文档和指南，了解如何使用我们的产品和服务",
    icon: FileText,
  },
  {
    key: "links",
    label: "导航",
    description: "发现精选的网站和工具，提高您的工作效率",
    icon: Compass,
  },
  {
    key: "friends",
    label: "友链",
    description: "探索我们的合作伙伴和友情链接，发现更多优质资源",
    icon: Link,
  },
  {
    key: "about",
    label: "关于",
    description: "了解我们的项目理念和个人主页，探索更多信息",
    icon: Info,
  },
] as const;

export const ADMIN_MENU_ITEMS = [
  {
    key: "admin",
    label: "管理",
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
] as const satisfies (NavConfigItem & {
  permission?: string;
})[];

// 扁平化所有导航项（包括子项）以便路径映射
const flattenNavItems = (items: readonly NavConfigItem[]): NavConfigItem[] => {
  const result: NavConfigItem[] = [];
  items.forEach(item => {
    result.push(item);
    if (item.children) {
      result.push(...item.children);
    }
  });
  return result;
};

const FLAT_NAV_ITEMS: NavConfigItem[] = flattenNavItems(NAV_ITEMS);

export const NAV_PATHS: Record<string, string> = {
  blog: "/blog",
  docs: "/docs",
  links: "/links",
  friends: "/friends",
  about: "/about",
} as const;

/**
 * 检查导航配置完整性
 */
// Navigation configuration validation removed for production

export const NAV_DESCRIPTIONS = Object.fromEntries(
  FLAT_NAV_ITEMS.map(item => [item.key, item.description])
) as Record<string, string>;
