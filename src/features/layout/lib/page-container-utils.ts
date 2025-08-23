/**
 * 页面容器和网格布局相关工具函数
 */

import type { GridColsMap, GridGapMap } from '../types/page-container';

/**
 * 网格列数样式映射
 */
export const gridColsMap: GridColsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
};

/**
 * 网格间距样式映射
 */
export const gridGapMap: GridGapMap = {
  small: 'gap-3',
  default: 'gap-6',
  large: 'gap-8',
};

/**
 * 响应式类名生成函数
 * 根据不同设备尺寸生成对应的显示/隐藏类名
 */
export function getResponsiveClasses(mobile: boolean, tablet: boolean, desktop: boolean): string {
  if (mobile && tablet && desktop) {
    return 'hidden'; // 全部隐藏
  } else if (mobile && tablet && !desktop) {
    return 'hidden xl:block'; // 移动端和平板隐藏，大屏显示
  } else if (mobile && !tablet && desktop) {
    return 'hidden md:block lg:hidden xl:block'; // 移动端隐藏，平板显示，PC隐藏，大屏显示
  } else if (mobile && !tablet && !desktop) {
    return 'hidden md:block'; // 移动端隐藏，平板及以上显示
  } else if (!mobile && tablet && desktop) {
    return 'md:hidden'; // 平板和PC隐藏，移动端和大屏显示
  } else if (!mobile && tablet && !desktop) {
    return 'md:hidden xl:block'; // 平板隐藏，移动端和大屏显示
  } else if (!mobile && !tablet && desktop) {
    return 'lg:hidden xl:block'; // PC隐藏，移动端、平板和大屏显示
  } else {
    return 'block'; // 全部显示
  }
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
export function getSidebarClasses(position: 'left' | 'right', hasBothSidebars: boolean): string {
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
