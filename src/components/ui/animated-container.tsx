"use client";

import React, { Children, cloneElement, isValidElement, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatedCard } from "./animated-card";

interface AnimatedContainerProps {
  /**
   * 子元素
   */
  children: React.ReactNode;

  /**
   * 基础延迟（秒）
   * 第一个元素的延迟时间
   * @default 0
   */
  baseDelay?: number;

  /**
   * 增量延迟（秒）
   * 每个后续元素增加的延迟时间
   * @default 0.1
   */
  staggerDelay?: number;

  /**
   * 动画持续时间（秒）
   * @default 0.5
   */
  duration?: number;

  /**
   * 是否禁用动画
   * @default false
   */
  disableAnimation?: boolean;

  /**
   * 动画变体
   * @default "slide-up"
   */
  variant?: "fade" | "slide-up" | "scale" | "pop";

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 是否自动包装子元素
   * 如果为 true，会自动将每个子元素包装在 AnimatedCard 中
   * 如果为 false，则期望子元素已经是 AnimatedCard
   * @default true
   */
  autoWrap?: boolean;

  /**
   * 视口阈值
   * @default 0.1
   */
  threshold?: number;

  /**
   * 视口边距
   * @default "0px"
   */
  rootMargin?: string;
}

/**
 * 动画容器组件
 *
 * 用于创建一组带有错开入场动画的元素
 * 自动为子元素添加递增的延迟，创造顺序动画效果
 *
 * @example
 * ```tsx
 * <AnimatedContainer staggerDelay={0.1} variant="slide-up">
 *   <Card>内容 1</Card>
 *   <Card>内容 2</Card>
 *   <Card>内容 3</Card>
 * </AnimatedContainer>
 * ```
 */
export function AnimatedContainer({
  children,
  baseDelay = 0,
  staggerDelay = 0.15,
  duration = 0.5,
  disableAnimation = false,
  variant = "fade",
  className = "",
  autoWrap = true,
  threshold = 0.1,
  rootMargin = "0px"
}: AnimatedContainerProps) {
  // 使用 pathname 确保在路由变化时重新渲染和触发动画
  const pathname = usePathname();
  // 如果禁用动画，直接渲染子元素
  if (disableAnimation) {
    return <div className={className}>{children}</div>;
  }

  // 处理子元素，添加动画效果
  const childrenWithAnimation = Children.map(children, (child, index) => {
    // 计算当前元素的延迟，确保延迟足够明显
    const delay = baseDelay + index * staggerDelay;

    // 如果不需要自动包装，且子元素是有效的 React 元素，则直接克隆并添加属性
    if (!autoWrap && isValidElement(child)) {
      // 检查子元素是否是我们的 AnimatedCard 组件
      // 如果是自定义组件，可以传递所有属性；如果是 DOM 元素，则只传递安全的属性
      const isCustomComponent = typeof child.type === 'function' || typeof child.type === 'object';

      if (isCustomComponent) {
        // 对于自定义组件，可以传递所有属性
        // 使用 key 确保每次路由变化时组件都会重新渲染
        return cloneElement(child, {
          delay,
          duration,
          variant,
          threshold,
          rootMargin,
          key: `animated-child-${index}-${pathname}`,
          ...child.props
        });
      } else {
        // 对于 DOM 元素，只传递安全的属性
        return cloneElement(child, {
          key: `animated-dom-${index}-${pathname}`,
          ...child.props
        });
      }
    }

    // 否则，用 AnimatedCard 包装子元素
    return (
      <AnimatedCard
        key={`animated-card-${index}-${pathname}`}
        delay={delay}
        duration={duration}
        variant={variant}
        threshold={threshold}
        rootMargin={rootMargin}
      >
        {child}
      </AnimatedCard>
    );
  });

  // 确保不将自定义属性传递给 DOM 元素
  // 使用 pathname 确保在路由变化时重新渲染和触发动画
  const [key, setKey] = useState(0);

  // 当路径变化时，更新 key 以触发重新渲染
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [pathname]);

  return (
    <div
      className={className || ""}
      data-animated-container
      style={{ display: 'contents' }}
      key={`${pathname}-${key}`}
    >
      {childrenWithAnimation}
    </div>
  );
}
