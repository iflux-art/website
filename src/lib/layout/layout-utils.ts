/**
 * 页面容器和网格布局相关工具函数
 */

import {
  getResponsiveClasses as baseGetResponsiveClasses,
  gridColsMap as baseGridColsMap,
  gridGapMap as baseGridGapMap,
} from './responsive-utils';
import type { GridColsMap, GridGapMap, PageContainerConfig, PageLayoutType } from '@/types';

// 重新导出以保持向后兼容性
export const gridColsMap: GridColsMap = baseGridColsMap;
export const gridGapMap: GridGapMap = baseGridGapMap;
export const getResponsiveClasses = baseGetResponsiveClasses;

/**
 * 获取布局对应的CSS类名
 */
export function getLayoutClassName(layout: PageLayoutType): string {
  const baseClasses = 'min-h-screen bg-background';

  switch (layout) {
    case 'full-width':
      return `${baseClasses} w-full`;
    case 'three-column':
    default:
      return baseClasses;
  }
}

/**
 * 获取容器CSS类名
 */
export function getContainerClassName(config: PageContainerConfig = {}): string {
  const { layout = 'full-width', className = '', minHeight = 'min-h-screen' } = config;

  const baseClasses = minHeight;
  const layoutClasses = getLayoutClassName(layout);

  return `${baseClasses} ${layoutClasses} ${className}`.trim();
}

/**
 * 获取主内容区域的响应式类名
 * 只支持双侧边栏和无侧边栏两种情况
 */
export function getMainContentClasses(hasLeftSidebar: boolean, hasRightSidebar: boolean): string {
  const baseClasses = 'min-w-0';

  if (hasLeftSidebar && hasRightSidebar) {
    // 双侧边栏：左3列 + 主内容6列 + 右3列 = 12列
    return `${baseClasses} md:col-span-6 lg:col-span-6 xl:col-span-6`;
  } else {
    // 无侧边栏：主内容占满12列
    return `${baseClasses} md:col-span-12 lg:col-span-12 xl:col-span-12`;
  }
}

/**
 * 获取侧边栏的响应式类名
 * 双侧边栏情况下，左右侧边栏都固定为3列
 */
export function getSidebarClasses(_position: 'left' | 'right', _hasBothSidebars: boolean): string {
  // 双侧边栏情况下，左右侧边栏都是3列
  return 'md:col-span-3 lg:col-span-3 xl:col-span-3';
}

/**
 * 侧边栏默认配置常量
 */
export const DEFAULT_SIDEBAR_CONFIG = {
  sticky: true,
  stickyTop: '80px',
  maxHeight: 'calc(100vh - 5rem - env(safe-area-inset-bottom))',
  responsive: {
    hideOnMobile: true,
    hideOnTablet: false,
    hideOnDesktop: false,
  },
} as const;

/**
 * 三栏布局默认配置常量
 * 双侧边栏模式：左3列 + 主内容6列 + 右3列
 */
export const THREE_COLUMN_LAYOUT_CONFIG = {
  leftSidebar: {
    sticky: true,
    stickyTop: '96px', // 导航栏64px + 顶部间距32px
    responsive: {
      hideOnMobile: true,
      hideOnTablet: false,
      hideOnDesktop: false,
    },
  },
  rightSidebar: {
    sticky: true,
    stickyTop: '96px', // 导航栏64px + 顶部间距32px
    responsive: {
      hideOnMobile: true,
      hideOnTablet: true, // 右侧边栏在平板上隐藏，只在桌面端显示
      hideOnDesktop: false,
    },
  },
} as const;

/**
 * 获取页面标题
 */
export function getPageTitle(title: string, siteName = ''): string {
  return siteName ? `${title} - ${siteName}` : title;
}
