"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 动画延迟（秒）
   * 用于创建错开的动画效果
   */
  delay?: number;

  /**
   * 动画持续时间（秒）
   */
  duration?: number;

  /**
   * 初始不透明度
   */
  initialOpacity?: number;

  /**
   * 初始Y轴偏移（像素）
   */
  initialY?: number;

  /**
   * 是否禁用动画
   */
  disableAnimation?: boolean;

  /**
   * 子元素
   */
  children: React.ReactNode;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 动画变体
   * - fade: 淡入
   * - slide-up: 从下向上滑入
   * - scale: 缩放
   * - pop: 弹出
   * @default "slide-up"
   */
  variant?: "fade" | "slide-up" | "scale" | "pop";

  /**
   * 自定义动画配置
   */
  customAnimation?: any;

  /**
   * 视口阈值
   * 元素可见比例超过该值时触发动画
   * @default 0.1
   */
  threshold?: number;

  /**
   * 视口边距
   * 元素距离视口边缘多少像素时开始监测
   * @default "0px"
   */
  rootMargin?: string;
}

/**
 * 动画卡片组件
 *
 * 用于创建带有入场动画效果的卡片元素
 * 支持多种动画效果，可自定义动画参数
 *
 * @example
 * ```tsx
 * <AnimatedCard delay={0.1} variant="slide-up">
 *   <YourCardContent />
 * </AnimatedCard>
 * ```
 */
export function AnimatedCard({
  delay = 0,
  duration = 0.5,
  initialOpacity = 0,
  initialY = 20,
  disableAnimation = false,
  children,
  className,
  variant = "slide-up",
  customAnimation,
  threshold = 0.1,
  rootMargin = "0px",
  ...props
}: AnimatedCardProps) {
  // 使用 Intersection Observer 检测元素是否在视口中
  const [ref, inView] = useInView({
    triggerOnce: false, // 允许多次触发，以支持页面切换后的重新动画
    threshold, // 可见阈值
    rootMargin, // 根边距
  });

  // 使用 pathname 来确保在路由变化时重新触发动画
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // 根据变体类型选择动画配置
  const getAnimationVariants = () => {
    if (customAnimation) return customAnimation;

    switch (variant) {
      case "fade":
        return {
          hidden: { opacity: initialOpacity, y: 10 }, // 添加轻微的向上移动效果
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              opacity: { duration, ease: [0.1, 0.5, 0.3, 1] },
              y: { duration: duration * 0.7, ease: [0.1, 0.5, 0.3, 1] }
            }
          }
        };
      case "scale":
        return {
          hidden: { opacity: initialOpacity, scale: 0.8 },
          visible: { opacity: 1, scale: 1 }
        };
      case "pop":
        return {
          hidden: { opacity: initialOpacity, scale: 0.5 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay
            }
          }
        };
      case "slide-up":
      default:
        return {
          hidden: { opacity: initialOpacity, y: initialY },
          visible: { opacity: 1, y: 0 }
        };
    }
  };

  // 如果禁用动画，直接渲染子元素
  if (disableAnimation) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  // 从 props 中移除自定义属性，避免它们被传递给 DOM 元素
  const { threshold: _, rootMargin: __, ...domProps } = props;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={getAnimationVariants()}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1] // 自定义缓动函数，类似于 cubic-bezier(0.22, 1, 0.36, 1)
      }}
      key={`${pathname}-${delay}`} // 使用 pathname 和 delay 作为 key，确保在路由变化时重新触发动画
      {...domProps}
    >
      {children}
    </motion.div>
  );
}
