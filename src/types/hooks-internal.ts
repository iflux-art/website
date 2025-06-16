/**
 * Hooks内部使用的类型定义
 */

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
