/**
 * 响应式工具函数
 * 提供Tailwind CSS响应式类名生成和管理功能
 */

import type { ResponsiveValue } from '@/types/responsive';
import { type DeviceType, getDeviceTypeFromWidth } from '@/config/responsive';

/**
 * 生成响应式类名
 * @param baseClass 基础类名
 * @param values 响应式值配置
 * @returns 完整的响应式类名字符串
 */
export function generateResponsiveClasses<T extends string>(
  baseClass: string,
  values: ResponsiveValue<T>
): string {
  const classes: string[] = [];

  // 添加默认值
  if (values.default) {
    classes.push(`${baseClass}-${values.default}`);
  }

  // 添加设备特定值
  if (values.mobile) {
    classes.push(`mobile:${baseClass}-${values.mobile}`);
  }

  if (values.tablet) {
    classes.push(`tablet:${baseClass}-${values.tablet}`);
  }

  if (values.desktop) {
    classes.push(`desktop:${baseClass}-${values.desktop}`);
  }

  if (values.large) {
    classes.push(`large:${baseClass}-${values.large}`);
  }

  return classes.join(' ');
}

/**
 * 生成响应式间距类名
 * @param property CSS属性 (p, m, px, py, mx, my等)
 * @param values 响应式间距值
 * @returns 响应式间距类名
 */
export function generateResponsiveSpacing(
  property: 'p' | 'm' | 'px' | 'py' | 'mx' | 'my',
  values: ResponsiveValue<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'>
): string {
  const classes: string[] = [];

  // 添加默认值
  if (values.default && values.default !== 'none') {
    classes.push(`${property}-${values.default}`);
  }

  // 添加设备特定值
  if (values.mobile && values.mobile !== 'none') {
    classes.push(`mobile:${property}-mobile-${values.mobile}`);
  }

  if (values.tablet && values.tablet !== 'none') {
    classes.push(`tablet:${property}-tablet-${values.tablet}`);
  }

  if (values.desktop && values.desktop !== 'none') {
    classes.push(`desktop:${property}-desktop-${values.desktop}`);
  }

  if (values.large && values.large !== 'none') {
    classes.push(`large:${property}-large-${values.large}`);
  }

  return classes.join(' ');
}

/**
 * 生成响应式网格类名
 * @param cols 响应式列数配置
 * @returns 响应式网格类名
 */
export function generateResponsiveGrid(cols: ResponsiveValue<number>): string {
  const classes: string[] = [];

  // 添加默认值
  if (cols.default) {
    classes.push(`grid-cols-${cols.default}`);
  }

  // 添加设备特定值
  if (cols.mobile) {
    classes.push(`mobile:grid-cols-${cols.mobile}`);
  }

  if (cols.tablet) {
    classes.push(`tablet:grid-cols-${cols.tablet}`);
  }

  if (cols.desktop) {
    classes.push(`desktop:grid-cols-${cols.desktop}`);
  }

  if (cols.large) {
    classes.push(`large:grid-cols-${cols.large}`);
  }

  return classes.join(' ');
}

/**
 * 生成响应式字体类名
 * @param values 响应式字体大小配置
 * @returns 响应式字体类名
 */
export function generateResponsiveText(
  values: ResponsiveValue<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'>
): string {
  const classes: string[] = [];

  // 添加默认值
  if (values.default) {
    classes.push(`text-${values.default}`);
  }

  // 添加设备特定值
  if (values.mobile) {
    classes.push(`mobile:text-mobile-${values.mobile}`);
  }

  if (values.tablet) {
    classes.push(`tablet:text-tablet-${values.tablet}`);
  }

  if (values.desktop) {
    classes.push(`desktop:text-desktop-${values.desktop}`);
  }

  if (values.large) {
    classes.push(`large:text-large-${values.large}`);
  }

  return classes.join(' ');
}

/**
 * 生成触摸优化类名
 * @param size 触摸目标大小
 * @param enableHover 是否启用hover效果
 * @returns 触摸优化类名
 */
export function generateTouchOptimizedClasses(
  size: 'small' | 'medium' | 'large' = 'medium',
  enableHover = true
): string {
  const classes: string[] = [];

  // 添加触摸目标尺寸
  classes.push(`min-h-touch-${size}`, `min-w-touch-${size}`);

  // 添加触摸操作优化
  classes.push('touch-manipulation');

  // 添加条件hover效果
  if (enableHover) {
    classes.push('mouse:hover:opacity-80', 'mouse:hover:scale-105');
  }

  // 添加触摸反馈
  classes.push('touch:opacity-75', 'active:scale-95');

  return classes.join(' ');
}

/**
 * 合并响应式类名
 * @param classes 类名数组
 * @returns 合并后的类名字符串
 */
export function mergeResponsiveClasses(...classes: (string | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * 根据当前设备类型获取对应的值
 * @param values 响应式值配置
 * @param currentDevice 当前设备类型
 * @returns 当前设备对应的值
 */
export function getResponsiveValue<T>(values: ResponsiveValue<T>, currentDevice: DeviceType): T {
  return values[currentDevice] ?? values.default;
}

/**
 * 根据窗口宽度获取响应式值
 * @param values 响应式值配置
 * @param width 窗口宽度
 * @returns 对应的值
 */
export function getResponsiveValueByWidth<T>(values: ResponsiveValue<T>, width: number): T {
  const device = getDeviceTypeFromWidth(width);
  return getResponsiveValue(values, device);
}

/**
 * 检查是否为响应式值
 * @param value 待检查的值
 * @returns 是否为响应式值
 */
export function isResponsiveValue<T>(value: T | ResponsiveValue<T>): value is ResponsiveValue<T> {
  return (
    typeof value === 'object' && value !== null && 'default' in value && value.default !== undefined
  );
}

/**
 * 将普通值转换为响应式值
 * @param value 普通值
 * @returns 响应式值
 */
export function toResponsiveValue<T>(value: T): ResponsiveValue<T> {
  return { default: value };
}

/**
 * 生成容器响应式类名
 * @param maxWidth 最大宽度配置
 * @param padding 内边距配置
 * @param centered 是否居中
 * @returns 容器类名
 */
export function generateContainerClasses(
  maxWidth?: ResponsiveValue<string>,
  padding?: ResponsiveValue<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
  centered = true
): string {
  const classes: string[] = [];

  // 基础容器类
  classes.push('w-full');

  if (centered) {
    classes.push('mx-auto');
  }

  // 最大宽度
  if (maxWidth) {
    if (maxWidth.default) {
      classes.push(`max-w-[${maxWidth.default}]`);
    }
    if (maxWidth.mobile) {
      classes.push(`mobile:max-w-[${maxWidth.mobile}]`);
    }
    if (maxWidth.tablet) {
      classes.push(`tablet:max-w-[${maxWidth.tablet}]`);
    }
    if (maxWidth.desktop) {
      classes.push(`desktop:max-w-[${maxWidth.desktop}]`);
    }
    if (maxWidth.large) {
      classes.push(`large:max-w-[${maxWidth.large}]`);
    }
  }

  // 内边距
  if (padding) {
    const paddingClasses = generateResponsiveSpacing('px', padding);
    classes.push(paddingClasses);
  }

  return classes.join(' ');
}

/**
 * 生成响应式显示/隐藏类名
 * @param showOn 显示在哪些设备上
 * @param hideOn 隐藏在哪些设备上
 * @returns 显示/隐藏类名
 */
export function generateVisibilityClasses(showOn?: DeviceType[], hideOn?: DeviceType[]): string {
  const classes: string[] = [];

  if (hideOn && hideOn.length > 0) {
    hideOn.forEach(device => {
      classes.push(`${device}:hidden`);
    });
  }

  if (showOn && showOn.length > 0) {
    // 默认隐藏，只在指定设备上显示
    classes.push('hidden');
    showOn.forEach(device => {
      classes.push(`${device}:block`);
    });
  }

  return classes.join(' ');
}

/**
 * 生成响应式gap类名
 */
function generateGapClasses(
  gap: ResponsiveValue<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'>
): string {
  const classes: string[] = [];

  if (gap.default && gap.default !== 'none') {
    classes.push(`gap-${gap.default}`);
  }
  if (gap.mobile && gap.mobile !== 'none') {
    classes.push(`mobile:gap-mobile-${gap.mobile}`);
  }
  if (gap.tablet && gap.tablet !== 'none') {
    classes.push(`tablet:gap-tablet-${gap.tablet}`);
  }
  if (gap.desktop && gap.desktop !== 'none') {
    classes.push(`desktop:gap-desktop-${gap.desktop}`);
  }
  if (gap.large && gap.large !== 'none') {
    classes.push(`large:gap-large-${gap.large}`);
  }

  return classes.join(' ');
}

/**
 * 生成响应式Flexbox类名
 * @param direction 响应式方向
 * @param justify 响应式对齐
 * @param align 响应式交叉轴对齐
 * @param gap 响应式间隙
 * @returns Flexbox类名
 */
export function generateFlexClasses(
  direction?: ResponsiveValue<'row' | 'col' | 'row-reverse' | 'col-reverse'>,
  justify?: ResponsiveValue<'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'>,
  align?: ResponsiveValue<'start' | 'center' | 'end' | 'stretch' | 'baseline'>,
  gap?: ResponsiveValue<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'>
): string {
  const classes: string[] = ['flex'];

  if (direction) {
    classes.push(generateResponsiveClasses('flex', direction));
  }

  if (justify) {
    classes.push(generateResponsiveClasses('justify', justify));
  }

  if (align) {
    classes.push(generateResponsiveClasses('items', align));
  }

  if (gap) {
    classes.push(generateGapClasses(gap));
  }

  return classes.join(' ');
}

/**
 * 预定义的响应式类名组合
 */
export const RESPONSIVE_PRESETS = {
  // 容器预设
  container: {
    fluid: 'w-full px-mobile-md tablet:px-tablet-md desktop:px-desktop-md large:px-large-md',
    fixed:
      'max-w-container-mobile tablet:max-w-container-tablet desktop:max-w-container-desktop large:max-w-container-large mx-auto px-mobile-md tablet:px-tablet-md desktop:px-desktop-md large:px-large-md',
    narrow:
      'max-w-2xl mx-auto px-mobile-md tablet:px-tablet-md desktop:px-desktop-md large:px-large-md',
  },

  // 网格预设
  grid: {
    responsive:
      'grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 large:grid-cols-4 gap-mobile-md tablet:gap-tablet-md desktop:gap-desktop-md large:gap-large-md',
    cards:
      'grid grid-cols-1 tablet:grid-cols-2 large:grid-cols-3 gap-mobile-lg tablet:gap-tablet-lg desktop:gap-desktop-lg large:gap-large-lg',
    list: 'grid grid-cols-1 gap-mobile-sm tablet:gap-tablet-sm desktop:gap-desktop-sm large:gap-large-sm',
  },

  // 文字预设
  text: {
    heading:
      'text-mobile-2xl tablet:text-tablet-2xl desktop:text-desktop-2xl large:text-large-2xl font-bold',
    subheading:
      'text-mobile-xl tablet:text-tablet-xl desktop:text-desktop-xl large:text-large-xl font-semibold',
    body: 'text-mobile-base tablet:text-tablet-base desktop:text-desktop-base large:text-large-base',
    caption:
      'text-mobile-sm tablet:text-tablet-sm desktop:text-desktop-sm large:text-large-sm text-muted-foreground',
  },

  // 按钮预设
  button: {
    primary:
      'min-h-touch-medium min-w-touch-medium px-mobile-md tablet:px-tablet-md desktop:px-desktop-md large:px-large-md touch-manipulation mouse:hover:opacity-90 active:scale-95',
    secondary:
      'min-h-touch-small min-w-touch-small px-mobile-sm tablet:px-tablet-sm desktop:px-desktop-sm large:px-large-sm touch-manipulation mouse:hover:opacity-80 active:scale-95',
  },
} as const;
