/**
 * 页面容器和网格布局相关工具函数
 * 简化为只支持宽布局作为默认网格布局
 */

// 网格列数样式映射
export const gridColsMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
} as const;

// 网格间距样式映射
export const gridGapMap = {
  small: "gap-3",
  default: "gap-4",
  large: "gap-4 sm:gap-4",
} as const;
