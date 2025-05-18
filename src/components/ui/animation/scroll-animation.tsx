"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideDown" | "slideRight" | "scaleUp" | "none";
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

/**
 * 滚动触发动画组件
 * 当元素进入视口时触发动画效果
 */
export function ScrollAnimation({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  triggerOnce = true,
  className = "",
}: ScrollAnimationProps) {
  const { ref, inView } = useInView({
    triggerOnce,
    threshold,
  });

  // 动画变体定义
  const animations: Record<string, Variants> = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    slideDown: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
    },
    slideRight: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
    },
    none: {
      initial: {},
      animate: {},
    },
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={selectedAnimation}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}