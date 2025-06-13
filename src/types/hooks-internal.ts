/**
 * Hooks内部使用的类型定义
 */

/**
 * 懒加载钩子配置项
 */
export interface UseLazyLoadOptions {
  /**
   * 是否只触发一次可见性变化。设置为true时,元素一旦可见就不会再次触发。
   * @default true
   */
  triggerOnce?: boolean;

  /**
   * 触发可见性检测的阈值,范围0-1。
   * 例如:0.5表示元素50%可见时触发。
   * @default 0
   */
  threshold?: number;

  /**
   * 是否跳过懒加载监测。
   * 设置为true时将不会监测元素可见性。
   * @default false 
   */
  skip?: boolean;

  /**
   * 用于检测可见性的根元素。
   * null表示使用视口。
   * @default null
   */
  root?: Element | null;

  /**
   * 根元素的外边距。
   * 用于扩展或收缩监测的根元素范围。
   * 例如:"100px 0px"代表上下扩展100px。
   * @default "0px"
   */
  rootMargin?: string;
}

/**
 * 滚动监听钩子配置项
 */
export interface UseScrollOptions {
  /**
   * 滚动事件的节流时间（毫秒）
   * @default 100
   */
  throttleMs?: number;

  /**
   * 是否在组件挂载时立即触发一次
   * @default true
   */
  triggerOnMount?: boolean;
}

/**
 * 滚动处理函数类型
 */
export type ScrollHandler = () => void;

/**
 * 节流后的滚动处理函数类型
 */
export type ThrottledScrollHandler = ReturnType<typeof import('lodash').throttle> & {
  cancel: () => void;
};

/**
 * 导航栏滚动配置项
 */
export interface UseNavbarScrollOptions {
  /** 滚动事件节流时间（毫秒） */
  throttleMs?: number;
  /** 自动隐藏阈值（像素） */
  threshold?: number;
  /** 初始显示状态 */
  initialVisible?: boolean;
}