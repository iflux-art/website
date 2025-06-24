import { Home, Globe, type LucideIcon } from 'lucide-react';

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

/**
 * 管理菜单项接口
 */
interface AdminNavItem extends BaseNavItem {
  /** 菜单图标 */
  icon: LucideIcon;
  /** 权限标识 */
  permission?: string;
}

/**
 * 主导航项配置
 * @description 定义网站主要导航结构
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
    key: 'links',
    label: '导航',
    description: '发现精选的网站和工具，提高您的工作效率',
  },
] as const satisfies readonly BaseNavItem[];

/**
 * 管理菜单配置
 * @description 定义后台管理界面的菜单结构
 */
export const ADMIN_MENU_ITEMS = [
  {
    key: 'admin',
    label: '仪表板',
    description: '查看系统概览和统计信息',
    icon: Home,
    permission: 'admin.dashboard.view',
  },
  {
    key: 'admin/links',
    label: '网址管理',
    description: '管理网站导航中的所有网址',
    icon: Globe,
    permission: 'admin.links.manage',
  },
] as const satisfies readonly AdminNavItem[];

/**
 * 导航项键名类型
 */
export type NavKey = (typeof NAV_ITEMS)[number]['key'];

/**
 * 导航路径映射
 * @description 用于生成导航URL
 */
export const NAV_PATHS: Record<NavKey, string> = {
  blog: '/blog',
  docs: '/docs',
  journal: '/journal',
  tools: '/tools',
  links: '/links',
} as const;

/**
 * 导航项描述文字
 * @description 用于显示导航项的详细描述
 */
export const NAV_DESCRIPTIONS: Record<NavKey, string> = {
  blog: NAV_ITEMS.find(item => item.key === 'blog')!.description,
  docs: NAV_ITEMS.find(item => item.key === 'docs')!.description,
  journal: NAV_ITEMS.find(item => item.key === 'journal')!.description,
  tools: NAV_ITEMS.find(item => item.key === 'tools')!.description,
  links: NAV_ITEMS.find(item => item.key === 'links')!.description,
} as const;

/**
 * 检查导航配置完整性
 */
if (process.env.NODE_ENV === 'development') {
  const navKeys = NAV_ITEMS.map(item => item.key);
  const pathKeys = Object.keys(NAV_PATHS);
  const descKeys = Object.keys(NAV_DESCRIPTIONS);

  // 确保所有配置项的key一致
  const allKeysMatch = navKeys.every(key => pathKeys.includes(key) && descKeys.includes(key));

  if (!allKeysMatch) {
    console.warn('Navigation configuration mismatch detected!');
    console.warn('NAV_ITEMS keys:', navKeys);
    console.warn('NAV_PATHS keys:', pathKeys);
    console.warn('NAV_DESCRIPTIONS keys:', descKeys);
  }
}
