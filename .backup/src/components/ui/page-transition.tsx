"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { pageTransition } from "@/lib/animations";

interface PageTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  motionProps?: MotionProps;
}

/**
 * 页面过渡动画组件
 * 为页面内容提供统一的过渡动画效果
 */
export function PageTransition({
  children,
  className,
  motionProps,
  ...props
}: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className={cn(className)}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}