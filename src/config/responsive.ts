/**
 * 响应式设计系统配置
 * 定义统一的断点标准、设备查询和响应式间距系统
 */

// 设备类型定义
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large';

// 断点配置接口
export interface BreakpointConfig {
  min: number;
  max: number;
  mediaQuery: string;
}

// 间距配置接口
export interface SpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

// 响应式配置接口
export interface ResponsiveConfig {
  breakpoints: Record<DeviceType, BreakpointConfig>;
  spacing: Record<DeviceType, SpacingConfig>;
  deviceQueries: Record<string, string>;
}

/**
 * 四个标准断点配置
 * 移动端: 0-768px
 * 平板端: 769-1024px
 * PC端: 1025-1440px
 * 大屏版: 1441px+
 */
export const BREAKPOINTS: Record<DeviceType, BreakpointConfig> = {
  mobile: {
    min: 0,
    max: 768,
    mediaQuery: '(max-width: 768px)',
  },
  tablet: {
    min: 769,
    max: 1024,
    mediaQuery: '(min-width: 769px) and (max-width: 1024px)',
  },
  desktop: {
    min: 1025,
    max: 1440,
    mediaQuery: '(min-width: 1025px) and (max-width: 1440px)',
  },
  large: {
    min: 1441,
    max: Infinity,
    mediaQuery: '(min-width: 1441px)',
  },
} as const;

/**
 * 设备查询配置
 * 包括尺寸查询和交互能力查询
 */
export const DEVICE_QUERIES = {
  // 尺寸查询
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px) and (max-width: 1440px)',
  large: '(min-width: 1441px)',

  // 交互能力查询
  touch: '(hover: none) and (pointer: coarse)',
  mouse: '(hover: hover) and (pointer: fine)',

  // 组合查询
  mobileAndTouch: '(max-width: 768px) and (hover: none)',
  desktopAndMouse: '(min-width: 1025px) and (hover: hover)',

  // 方向查询
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',

  // 可访问性查询
  reducedMotion: '(prefers-reduced-motion: reduce)',
  highContrast: '(prefers-contrast: high)',
} as const;

/**
 * 响应式间距系统
 * 每个设备类型都有对应的间距标准
 */
export const RESPONSIVE_SPACING: Record<DeviceType, SpacingConfig> = {
  mobile: {
    xs: '0.5rem', // 8px
    sm: '0.75rem', // 12px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
  },
  tablet: {
    xs: '0.75rem', // 12px
    sm: '1rem', // 16px
    md: '1.5rem', // 24px
    lg: '2rem', // 32px
    xl: '3rem', // 48px
  },
  desktop: {
    xs: '1rem', // 16px
    sm: '1.5rem', // 24px
    md: '2rem', // 32px
    lg: '3rem', // 48px
    xl: '4rem', // 64px
  },
  large: {
    xs: '1.5rem', // 24px
    sm: '2rem', // 32px
    md: '3rem', // 48px
    lg: '4rem', // 64px
    xl: '6rem', // 96px
  },
} as const;

/**
 * 触摸目标尺寸标准
 * 符合WCAG可访问性指南
 */
export const TOUCH_TARGET_SIZES = {
  small: '44px', // WCAG AA标准最小触摸目标
  medium: '48px', // 推荐的舒适触摸目标
  large: '56px', // 大触摸目标，适用于重要操作
} as const;

/**
 * 响应式字体大小系统
 */
export const RESPONSIVE_TYPOGRAPHY = {
  mobile: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  tablet: {
    xs: '0.875rem', // 14px
    sm: '1rem', // 16px
    base: '1.125rem', // 18px
    lg: '1.25rem', // 20px
    xl: '1.5rem', // 24px
    '2xl': '1.875rem', // 30px
    '3xl': '2.25rem', // 36px
    '4xl': '3rem', // 48px
  },
  desktop: {
    xs: '0.875rem', // 14px
    sm: '1rem', // 16px
    base: '1.125rem', // 18px
    lg: '1.25rem', // 20px
    xl: '1.5rem', // 24px
    '2xl': '1.875rem', // 30px
    '3xl': '2.25rem', // 36px
    '4xl': '3rem', // 48px
  },
  large: {
    xs: '1rem', // 16px
    sm: '1.125rem', // 18px
    base: '1.25rem', // 20px
    lg: '1.5rem', // 24px
    xl: '1.875rem', // 30px
    '2xl': '2.25rem', // 36px
    '3xl': '3rem', // 48px
    '4xl': '3.75rem', // 60px
  },
} as const;

/**
 * 完整的响应式配置对象
 */
export const RESPONSIVE_CONFIG: ResponsiveConfig = {
  breakpoints: BREAKPOINTS,
  spacing: RESPONSIVE_SPACING,
  deviceQueries: DEVICE_QUERIES,
} as const;

/**
 * 工具函数：获取设备类型对应的断点配置
 */
export function getBreakpointConfig(device: DeviceType): BreakpointConfig {
  return BREAKPOINTS[device];
}

/**
 * 工具函数：获取设备类型对应的间距配置
 */
export function getSpacingConfig(device: DeviceType): SpacingConfig {
  return RESPONSIVE_SPACING[device];
}

/**
 * 工具函数：根据宽度判断设备类型
 */
export function getDeviceTypeFromWidth(width: number): DeviceType {
  if (width <= BREAKPOINTS.mobile.max) return 'mobile';
  if (width <= BREAKPOINTS.tablet.max) return 'tablet';
  if (width <= BREAKPOINTS.desktop.max) return 'desktop';
  return 'large';
}

/**
 * 工具函数：检查是否为触摸设备
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(DEVICE_QUERIES.touch).matches;
}

/**
 * 工具函数：检查是否支持hover
 */
export function supportsHover(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia(DEVICE_QUERIES.mouse).matches;
}
