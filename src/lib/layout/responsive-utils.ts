/**
 * 响应式相关工具函数
 */

/**
 * 网格列数样式映射
 */
export const gridColsMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
} as const;

/**
 * 网格间距样式映射
 */
export const gridGapMap = {
  small: "gap-3",
  default: "gap-4",
  large: "gap-4 sm:gap-4",
} as const;

/**
 * 响应式类名配置表
 * 使用位运算生成的索引来查找对应的CSS类名
 */
const RESPONSIVE_CLASS_MAP: Record<number, string> = {
  0: "block", // 000: 全部显示
  1: "lg:hidden xl:block", // 001: PC隐藏，移动端、平板和大屏显示
  2: "md:hidden xl:block", // 010: 平板隐藏，移动端和大屏显示
  3: "md:hidden", // 011: 平板和PC隐藏，移动端和大屏显示
  4: "hidden md:block", // 100: 移动端隐藏，平板及以上显示
  5: "hidden md:block lg:hidden xl:block", // 101: 移动端隐藏，平板显示，PC隐藏，大屏显示
  6: "hidden xl:block", // 110: 移动端和平板隐藏，大屏显示
  7: "hidden", // 111: 全部隐藏
};

/**
 * 响应式类名生成函数
 * 根据不同设备尺寸生成对应的显示/隐藏类名
 */
export function getResponsiveClasses(mobile: boolean, tablet: boolean, desktop: boolean): string {
  // 使用位运算生成索引：移动端(bit 2) + 平板(bit 1) + PC(bit 0)
  const index = (mobile ? 0b100 : 0) | (tablet ? 0b010 : 0) | (desktop ? 0b001 : 0);
  return RESPONSIVE_CLASS_MAP[index] || "block";
}
