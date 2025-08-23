/**
 * 响应式设计系统的TypeScript类型定义
 * 确保类型安全的响应式开发
 */

import type { DeviceType } from '@/config/responsive';

/**
 * 响应式值类型
 * 支持为不同设备类型定义不同的值
 */
export interface ResponsiveValue<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  large?: T;
  default: T;
}

/**
 * 响应式CSS属性值
 */
export type ResponsiveCSSValue = ResponsiveValue<string | number>;

/**
 * 设备信息接口
 */
export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  isTouch: boolean;
  isMouse: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  supportsHover: boolean;
  prefersReducedMotion: boolean;
}

/**
 * 媒体查询Hook返回类型
 */
export interface MediaQueryResult {
  matches: boolean;
  media: string;
}

/**
 * 断点监听Hook配置
 */
export interface BreakpointHookConfig {
  defaultValue?: DeviceType;
  serverSideValue?: DeviceType;
}

/**
 * 响应式状态Hook配置
 */
export interface ResponsiveStateConfig<T> {
  initialValue: ResponsiveValue<T>;
  serverSideValue?: T;
}

/**
 * 组件响应式Props基础接口
 */
export interface ResponsiveComponentProps {
  /**
   * 响应式类名
   */
  className?: string;

  /**
   * 响应式样式对象
   */
  style?: React.CSSProperties;

  /**
   * 是否在服务端渲染时隐藏
   */
  hideOnSSR?: boolean;
}

/**
 * 触摸优化Props接口
 */
export interface TouchOptimizedProps {
  /**
   * 触摸目标大小
   */
  touchTarget?: 'small' | 'medium' | 'large';

  /**
   * 是否启用hover效果（自动检测设备能力）
   */
  enableHover?: boolean;

  /**
   * 触摸反馈类型
   */
  touchFeedback?: 'none' | 'opacity' | 'scale' | 'highlight';
}

/**
 * 响应式布局Props接口
 */
export interface ResponsiveLayoutProps {
  /**
   * 响应式间距
   */
  spacing?: ResponsiveValue<'xs' | 'sm' | 'md' | 'lg' | 'xl'>;

  /**
   * 响应式最大宽度
   */
  maxWidth?: ResponsiveValue<string>;

  /**
   * 响应式内边距
   */
  padding?: ResponsiveValue<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'>;

  /**
   * 响应式外边距
   */
  margin?: ResponsiveValue<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'>;
}

/**
 * 响应式网格Props接口
 */
export interface ResponsiveGridProps extends ResponsiveLayoutProps {
  /**
   * 响应式列数
   */
  cols?: ResponsiveValue<number>;

  /**
   * 响应式行数
   */
  rows?: ResponsiveValue<number>;

  /**
   * 响应式间隙
   */
  gap?: ResponsiveValue<'xs' | 'sm' | 'md' | 'lg' | 'xl'>;

  /**
   * 响应式对齐方式
   */
  align?: ResponsiveValue<'start' | 'center' | 'end' | 'stretch'>;

  /**
   * 响应式分布方式
   */
  justify?: ResponsiveValue<'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'>;
}

/**
 * 响应式文字Props接口
 */
export interface ResponsiveTypographyProps {
  /**
   * 响应式字体大小
   */
  fontSize?: ResponsiveValue<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'>;

  /**
   * 响应式行高
   */
  lineHeight?: ResponsiveValue<'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'>;

  /**
   * 响应式字重
   */
  fontWeight?: ResponsiveValue<'light' | 'normal' | 'medium' | 'semibold' | 'bold'>;

  /**
   * 响应式文本对齐
   */
  textAlign?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>;
}

/**
 * 响应式导航Props接口
 */
export interface ResponsiveNavigationProps {
  /**
   * 导航变体
   */
  variant?: 'mobile' | 'tablet' | 'desktop' | 'large' | 'auto';

  /**
   * 是否显示移动端底部导航
   */
  showBottomNav?: boolean;

  /**
   * 是否可折叠
   */
  collapsible?: boolean;

  /**
   * 折叠断点
   */
  collapseAt?: DeviceType;

  /**
   * 导航项目
   */
  items: NavigationItem[];
}

/**
 * 导航项目接口
 */
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavigationItem[];
  showOnDevices?: DeviceType[];
  hideOnDevices?: DeviceType[];
}

/**
 * 响应式容器Props接口
 */
export interface ResponsiveContainerProps extends ResponsiveLayoutProps {
  /**
   * 容器类型
   */
  variant?: 'fluid' | 'fixed' | 'responsive';

  /**
   * 是否居中
   */
  centered?: boolean;

  /**
   * 子元素
   */
  children: React.ReactNode;
}

/**
 * 响应式图片Props接口
 */
export interface ResponsiveImageProps {
  /**
   * 图片源
   */
  src: string;

  /**
   * 替代文本
   */
  alt: string;

  /**
   * 响应式尺寸
   */
  sizes?: ResponsiveValue<string>;

  /**
   * 响应式宽度
   */
  width?: ResponsiveValue<number>;

  /**
   * 响应式高度
   */
  height?: ResponsiveValue<number>;

  /**
   * 响应式对象适配
   */
  objectFit?: ResponsiveValue<'contain' | 'cover' | 'fill' | 'none' | 'scale-down'>;

  /**
   * 响应式圆角
   */
  borderRadius?: ResponsiveValue<'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>;
}

/**
 * 响应式表单Props接口
 */
export interface ResponsiveFormProps {
  /**
   * 表单布局
   */
  layout?: ResponsiveValue<'vertical' | 'horizontal' | 'inline'>;

  /**
   * 标签位置
   */
  labelPosition?: ResponsiveValue<'top' | 'left' | 'right'>;

  /**
   * 字段间距
   */
  fieldSpacing?: ResponsiveValue<'xs' | 'sm' | 'md' | 'lg' | 'xl'>;

  /**
   * 是否启用触摸优化
   */
  touchOptimized?: boolean;
}

/**
 * 响应式Hook返回类型
 */
export interface ResponsiveHookReturn<T> {
  value: T;
  device: DeviceType;
  isLoading: boolean;
  error?: Error;
}

/**
 * 响应式配置上下文类型
 */
export interface ResponsiveContextValue {
  device: DeviceType;
  deviceInfo: DeviceInfo;
  breakpoints: Record<DeviceType, { min: number; max: number }>;
  isSSR: boolean;
  updateDevice: (device: DeviceType) => void;
}

/**
 * 响应式Provider Props
 */
export interface ResponsiveProviderProps {
  children: React.ReactNode;
  defaultDevice?: DeviceType;
  ssrDevice?: DeviceType;
  enableDeviceDetection?: boolean;
}

/**
 * 工具类型：提取响应式值
 */
export type ExtractResponsiveValue<T> = T extends ResponsiveValue<infer U> ? U : T;

/**
 * 工具类型：响应式Props映射
 */
export type ResponsiveProps<T> = {
  [K in keyof T]: T[K] | ResponsiveValue<T[K]>;
};

/**
 * 工具类型：设备特定Props
 */
export type DeviceSpecificProps<T> = {
  [K in DeviceType]?: T;
} & {
  default?: T;
};

/**
 * CSS-in-JS响应式样式类型
 */
export interface ResponsiveStyles {
  [key: string]: ResponsiveCSSValue | ResponsiveStyles;
}

/**
 * 响应式类名映射类型
 */
export type ResponsiveClassNames = {
  [K in DeviceType]?: string;
} & {
  base?: string;
  default?: string;
};
