"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { scrollRevealUp, fadeIn as scrollFadeIn } from "@/lib/animations";
import { ScrollAnimationProps } from './scroll-animation.types';
/**
 * 滚动动画组件
 * 为元素提供基于滚动位置的动画效果
 */
export function ScrollAnimation({
  children,
  className,
  type = "fadeIn",
  threshold = 0.1,
  triggerOnce = true,
  delay = 0,
  motionProps,
  customVariants,
  ...props
}: ScrollAnimationProps) {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  });

  // 根据类型选择动画变体
  const getVariants = () => {
    switch (type) {
      case "slideUp":
        return scrollRevealUp;
      case "fadeIn":
        return scrollFadeIn;
      case "custom":
        return customVariants;
      default:
        return scrollFadeIn;
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={getVariants()}
      transition={{ delay }}
      className={cn(className)}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}