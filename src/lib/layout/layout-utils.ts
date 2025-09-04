/**
 * 页面容器和网格布局相关工具函数
 */

import type { GridColsMap, GridGapMap, PageContainerConfig, PageLayoutType } from "@/types";
import {
  getResponsiveClasses as baseGetResponsiveClasses,
  gridColsMap as baseGridColsMap,
  gridGapMap as baseGridGapMap,
} from "./responsive-utils";

// 重新导出以保持向后兼容性
export const gridColsMap: GridColsMap = baseGridColsMap;
export const gridGapMap: GridGapMap = baseGridGapMap;
export const getResponsiveClasses = baseGetResponsiveClasses;

/**
 * 获取布局对应的CSS类名
 */
export function getLayoutClassName(layout: PageLayoutType): string {
  const baseClasses = "min-h-screen bg-background";

  switch (layout) {
    case "full-width":
      return `${baseClasses} w-full`;
    default:
      return baseClasses;
  }
}

/**
 * 获取容器CSS类名
 */
export function getContainerClassName(config: PageContainerConfig = {}): string {
  const { layout = "full-width", className = "", minHeight = "min-h-screen" } = config;

  const baseClasses = minHeight;
  const layoutClasses = getLayoutClassName(layout);

  return `${baseClasses} ${layoutClasses} ${className}`.trim();
}

/**
 * 获取主内容区域的响应式类名
 * 支持三种布局类型：
 * 1. 窄布局(narrow)：主内容占8列
 * 2. 双侧栏布局(double-sidebar)：左右侧栏各占2列，主内容占8列
 * 3. 宽布局(full-width)：主内容占满12列
 */
export function getMainContentClasses(layout: PageLayoutType): string {
  const baseClasses = "min-w-0";

  switch (layout) {
    case "narrow":
      // 窄布局：主内容占8列
      return `${baseClasses} md:col-span-8 lg:col-span-8 xl:col-span-8 md:col-start-3 lg:col-start-3 xl:col-start-3`;
    case "double-sidebar":
      // 双侧栏布局：左右侧栏各占2列，主内容占8列
      return `${baseClasses} md:col-span-8 lg:col-span-8 xl:col-span-8 md:col-start-3 lg:col-start-3 xl:col-start-3`;
    default:
      // 宽布局：主内容占满12列
      return `${baseClasses} md:col-span-12 lg:col-span-12 xl:col-span-12`;
  }
}

/**
 * 获取侧边栏的响应式类名
 * 根据布局类型和侧边栏位置返回相应的类名
 */
export function getSidebarClasses(position: "left" | "right", layout: PageLayoutType): string {
  switch (layout) {
    case "narrow":
      // 窄布局不显示侧边栏
      return "hidden";
    case "double-sidebar":
      // 双侧栏布局：左右侧栏各占2列
      if (position === "left") {
        return "md:col-span-2 lg:col-span-2 xl:col-span-2 md:col-start-1 lg:col-start-1 xl:col-start-1";
      } else {
        return "md:col-span-2 lg:col-span-2 xl:col-span-2 md:col-start-11 lg:col-start-11 xl:col-start-11";
      }
    default:
      // 宽布局不显示侧边栏
      return "hidden";
  }
}

/**
 * 侧边栏默认配置常量
 */
export const DEFAULT_SIDEBAR_CONFIG = {
  sticky: true,
  stickyTop: "80px",
  maxHeight: "calc(100vh - 5rem - env(safe-area-inset-bottom))",
  responsive: {
    hideOnMobile: true,
    hideOnTablet: false,
    hideOnDesktop: false,
  },
} as const;

/**
 * 三栏布局默认配置常量
 * 双侧边栏模式：左2列 + 主内容6列 + 右2列
 */
export const THREE_COLUMN_LAYOUT_CONFIG = {
  leftSidebar: {
    sticky: true,
    stickyTop: "96px", // 导航栏64px + 顶部间距32px
    responsive: {
      hideOnMobile: true,
      hideOnTablet: false,
      hideOnDesktop: false,
    },
  },
  rightSidebar: {
    sticky: true,
    stickyTop: "96px", // 导航栏64px + 顶部间距32px
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
export function getPageTitle(title: string, siteName = ""): string {
  return siteName ? `${title} - ${siteName}` : title;
}
