'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

/**
 * 滚动动画类型
 */
export type AnimationType =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'none';

/**
 * 滚动动画组件属性
 */
export interface ScrollAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children: React.ReactNode;

  /**
   * 动画类型
   * @default "fade"
   */
  type?: AnimationType;

  /**
   * 视口阈值
   * @default 0.1
   */
  threshold?: number;

  /**
   * 是否只触发一次
   * @default true
   */
  triggerOnce?: boolean;

  /**
   * 动画延迟（秒）
   * @default 0
   */
  delay?: number;

  /**
   * 动画持续时间（毫秒）
   * @default 700
   */
  duration?: number;
}

/**
 * 滚动动画组件
 * 为元素提供基于滚动位置的动画效果
 *
 * @example
 * ```tsx
 * <ScrollAnimation type="slide-up" delay={0.2}>
 *   <div>滚动时显示的内容</div>
 * </ScrollAnimation>
 * ```
 */
export function ScrollAnimation({
  children,
  className,
  type = 'fade',
  threshold = 0.1,
  triggerOnce = true,
  delay = 0,
  duration = 700,
  ...props
}: ScrollAnimationProps) {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  });

  // 根据类型选择动画类名
  const getAnimationClass = () => {
    if (!inView) {
      switch (type) {
        case 'slide-up':
          return 'opacity-0 translate-y-8';
        case 'slide-down':
          return 'opacity-0 -translate-y-8';
        case 'slide-left':
          return 'opacity-0 translate-x-8';
        case 'slide-right':
          return 'opacity-0 -translate-x-8';
        case 'scale':
          return 'opacity-0 scale-95';
        case 'fade':
          return 'opacity-0';
        case 'none':
          return '';
        default:
          return 'opacity-0';
      }
    }

    return 'opacity-100 translate-y-0 translate-x-0 scale-100';
  };

  return (
    <div
      ref={ref}
      className={cn(`transition-all duration-${duration}`, getAnimationClass(), className)}
      style={{
        transitionDelay: `${delay}s`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
