import { Home, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface AdminMenuItem {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

/**
 * 导航项配置
 */
export const NAV_ITEMS = [
  {
    key: 'blog',
    label: '博客',
    description: '阅读最新的博客文章，了解行业动态和技术趋势',
  },
  {
    key: 'docs',
    label: '文档',
    description: '查看详细的文档和指南，了解如何使用我们的产品和服务',
  },
  {
    key: 'journal',
    label: '日志',
    description: '浏览时间轴格式的文章和文档更新记录',
  },
  {
    key: 'tools',
    label: '工具',
    description: '发现实用的在线工具，提升工作和学习效率',
  },
  {
    key: 'navigation',
    label: '导航',
    description: '发现精选的网站和工具，提高您的工作效率',
  },
] as const;

/**
 * 管理菜单项配置
 */
export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  {
    key: 'admin',
    label: '仪表板',
    description: '查看系统概览和统计信息',
    icon: Home,
  },
  {
    key: 'admin/navigation',
    label: '网址管理',
    description: '管理网站导航中的所有网址',
    icon: Globe,
  },
] as const;

/**
 * 导航项说明文字
 */
export type NavKey = (typeof NAV_ITEMS)[number]['key'];

export const NAV_DESCRIPTIONS: Record<NavKey, string> = {
  blog: '阅读最新的博客文章，了解行业动态和技术趋势',
  docs: '查看详细的文档和指南，了解如何使用我们的产品和服务',
  journal: '浏览时间轴格式的文章和文档更新记录',
  tools: '发现实用的在线工具，提升工作和学习效率',
  navigation: '发现精选的网站和工具，提高您的工作效率',
};
