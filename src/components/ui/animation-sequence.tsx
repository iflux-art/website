"use client";

import React, { Children, cloneElement, isValidElement } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * animation-sequence 组件类型定义
 */
export interface AnimationSequenceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  inView?: boolean;
  variants?: Variants;
}

export interface AnimationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  variants?: Variants;
}

/**
 * 动画序列组件
 * 为子元素提供顺序动画效果，适用于列表或多元素动画
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export function AnimationSequence({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
  inView = true,
  variants,
  ...props
}: AnimationSequenceProps) {
  // 默认容器动画变体
  const containerVariants: Variants = variants || {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={containerVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * 动画序列项组件
 * 作为AnimationSequence的子项，提供单个元素的动画效果
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export function AnimationItem({
  children,
  className,
  variants,
  delay = 0,
  ...props
}: AnimationItemProps) {
  // 默认项目动画变体
  const itemVariants: Variants = variants || {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay,
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      variants={itemVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
