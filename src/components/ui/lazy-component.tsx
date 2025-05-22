"use client";

import React, { Suspense, ComponentType, ReactNode, useEffect, useState } from "react";
import { lazyLoadComponent, createLazyContainer } from "@/lib/lazy-loading";
import { cn } from "@/lib/utils";

/**
 * lazy-component 组件类型定义
 */
export interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  props?: Record<string, any>;
  fadeIn?: boolean;
  fadeInDuration?: number;
  delayLoad?: number;
  threshold?: number;
  className?: string;
}

export interface LazyComponentOptions {
  /** 自定义加载占位符 */
  fallback?: ReactNode;
  /** 是否启用淡入效果 */
  fadeIn?: boolean;
  /** 淡入动画持续时间(ms) */
  fadeInDuration?: number;
  /** 延迟加载时间(ms) */
  delayLoad?: number;
  /** 可见阈值 0-1 */
  threshold?: number;
  /** 自定义类名 */
  className?: string;
}

/**
 * 组件懒加载包装器
 * 提供统一的组件懒加载功能，支持自定义加载占位符和动画效果
 */
/**
 * 懒加载组件
 * 提供统一的组件懒加载功能，支持自定义加载占位符和动画效果
 */
export function LazyComponent({
  component,
  fallback = <div className="flex items-center justify-center p-4">加载中...</div>,
  props = {},
  fadeIn = true,
  fadeInDuration = 500,
  delayLoad = 0,
  threshold = 0.1,
  className
}: LazyComponentProps) {
  // 使用懒加载容器
  const { ref, inView, className: animationClass, style } = createLazyContainer({
    triggerOnce: true,
    threshold,
    fadeIn,
    fadeInDuration,
    delayTime: delayLoad
  });

  // 控制组件显示的状态
  const [shouldRender, setShouldRender] = useState(false);

  // 处理延迟加载
  useEffect(() => {
    if (inView) {
      if (delayLoad > 0) {
        const timer = setTimeout(() => setShouldRender(true), delayLoad);
        return () => clearTimeout(timer);
      } else {
        setShouldRender(true);
      }
    }
  }, [inView, delayLoad]);

  // 创建懒加载组件
  const LazyLoadedComponent = lazyLoadComponent(component, fallback);

  return (
    <div ref={ref} className={cn(className)}>
      {shouldRender ? (
        <div
          style={fadeIn ? style : undefined}
          className={cn(fadeIn ? animationClass : '')}
        >
          <LazyLoadedComponent {...props} />
        </div>
      ) : inView ? (
        // 当在视图中但尚未渲染时显示最小高度占位符
        <div style={{ minHeight: "50px" }} className="animate-pulse bg-muted/10 rounded" />
      ) : null}
    </div>
  );

}

/**
 * 创建懒加载组件
 * 工厂函数，用于创建可重用的懒加载组件
 * @param importFunc 动态导入函数
 * @param defaultFallback 默认加载占位符
 * @returns 懒加载组件包装器
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  defaultFallback: ReactNode = <div className="flex items-center justify-center p-4">加载中...</div>
) {
  return function LazyComponentWrapper(props: React.ComponentProps<T> & LazyComponentOptions) {
    const {
      fallback = defaultFallback,
      fadeIn = true,
      fadeInDuration = 500,
      delayLoad = 0,
      threshold = 0.1,
      className,
      ...componentProps
    } = props;

    return (
      <LazyComponent
        component={importFunc}
        props={componentProps}
        fallback={fallback}
        fadeIn={fadeIn}
        fadeInDuration={fadeInDuration}
        delayLoad={delayLoad}
        threshold={threshold}
        className={className}
      />
    );
  };
}
