/**
 * 懒加载和动画优化工具
 * 提供全站一致的懒加载和动画优化功能
 */

import React from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * 懒加载组件包装器
 * @param importFunc 动态导入函数
 * @param fallback 加载时显示的组件
 * @returns 懒加载的组件
 */
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = React.createElement("div", { className: "flex items-center justify-center p-8" }, "加载中...")
) {
  // 确保React.lazy接收的是返回Promise的函数
  const LazyComponent = React.lazy(() => importFunc());
  
  return function LazyLoadWrapper(props: React.ComponentProps<T>) {
    return React.createElement(
      React.Suspense,
      { fallback: fallback },
      React.createElement(LazyComponent, props)
    );
  };
}

/**
 * 使用视图检测的动画组件
 * @param options 视图检测选项
 * @returns 包含ref和inView的对象
 */
export function useAnimationInView(options = { triggerOnce: true, threshold: 0.1 }) {
  return useInView(options);
}

/**
 * 图片懒加载优先级设置
 * @param index 图片索引
 * @returns 图片加载属性
 */
export function getImageLoadingProps(index: number) {
  return {
    priority: index === 0,
    loading: index === 0 ? 'eager' : 'lazy' as 'eager' | 'lazy',
  };
}

/**
 * 延迟加载函数
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 懒加载容器组件配置选项
 */
export interface LazyContainerOptions {
  /** 是否只触发一次 */
  triggerOnce?: boolean;
  /** 可见阈值 0-1 */
  threshold?: number;
  /** 根边距 */
  rootMargin?: string;
  /** 是否启用淡入效果 */
  fadeIn?: boolean;
  /** 淡入动画持续时间(ms) */
  fadeInDuration?: number;
  /** 延迟加载时间(ms) */
  delayTime?: number;
}

/**
 * 创建懒加载容器
 * 提供统一的懒加载容器配置，支持自定义动画效果
 * @param options 懒加载选项
 * @returns 包含ref、inView和样式类名的对象
 */
export function createLazyContainer(options: LazyContainerOptions = {}) {
  const {
    triggerOnce = true,
    threshold = 0.1,
    rootMargin = '0px',
    fadeIn = true,
    fadeInDuration = 500,
    delayTime = 0
  } = options;
  
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
    rootMargin
  });
  
  // 使用固定的过渡类名，避免字符串模板可能导致的问题
  const className = fadeIn 
    ? `transition-opacity ${inView ? 'opacity-100' : 'opacity-0'}` 
    : '';
  
  return {
    ref,
    inView,
    className,
    // 提供完整的样式对象，包含过渡属性和持续时间
    style: fadeIn ? { 
      transitionProperty: 'opacity',
      transitionDuration: `${fadeInDuration}ms`,
      transitionTimingFunction: 'ease-in-out'
    } : undefined,
    delayTime
  };

}