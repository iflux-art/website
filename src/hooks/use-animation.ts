"use client";

import { useState, useEffect } from "react";
import * as animations from "@/lib/animations";

// 定义自己的类型，替代 framer-motion 的类型
interface Transition {
  delay?: number;
  duration?: number;
  ease?: string | number[];
}

interface Variant {
  x?: number | string;
  y?: number | string;
  opacity?: number;
  scale?: number;
  rotate?: number;
  transition?: Transition;
}

interface Variants {
  initial?: Variant;
  animate?: Variant;
  exit?: Variant;
  transition?: Transition;
  [key: string]: any;
}

interface AnimationConfig {
  delay?: number;
  duration?: number;
}

type AnimationKey = keyof typeof animations;

/**
 * 动画Hook，用于在组件中方便地使用预定义动画
 *
 * @param animationKey 动画名称，对应animations.ts中定义的动画
 * @param options 额外的动画选项
 * @returns 动画变体对象
 *
 * @example
 * const fadeAnimation = useAnimation('fadeIn');
 * <motion.div variants={fadeAnimation}>内容</motion.div>
 */
export function useAnimation(
  animationKey: AnimationKey,
  options?: {
    delay?: number;
    duration?: number;
    custom?: AnimationConfig;
  }
): Variants {
  const [animation, setAnimation] = useState<Variants>({});

  useEffect(() => {
    // 获取基础动画
    const baseAnimation = animations[animationKey] as Variants;

    if (!baseAnimation) {
      console.warn(`Animation "${animationKey}" not found`);
      return;
    }

    // 合并自定义选项
    const customizedAnimation = { ...baseAnimation };

    // 如果有自定义过渡选项，应用它们
    if (options && customizedAnimation.transition) {
      customizedAnimation.transition = {
        ...customizedAnimation.transition,
        delay: options.delay,
        duration: options.duration,
      };
    }

    setAnimation(customizedAnimation);
  }, [animationKey, options]);

  return animation;
}

/**
 * 页面过渡动画Hook
 * 提供页面切换时的标准动画效果
 *
 * @returns 页面过渡动画变体
 *
 * @example
 * const pageAnimation = usePageTransition();
 * <motion.main variants={pageAnimation}>页面内容</motion.main>
 */
export function usePageTransition(): Variants {
  return useAnimation('pageTransition');
}

/**
 * 元素进入动画Hook
 * 提供元素进入视图时的标准动画效果
 *
 * @param options 动画选项
 * @returns 元素进入动画变体
 *
 * @example
 * const enterAnimation = useEnterAnimation({ delay: 0.2 });
 * <motion.div variants={enterAnimation}>内容</motion.div>
 */
export function useEnterAnimation(options?: { delay?: number; duration?: number }): Variants {
  return useAnimation('fadeIn', options);
}