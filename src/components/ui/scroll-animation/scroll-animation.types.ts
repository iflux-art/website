/**
 * scroll-animation 组件类型定义
 */

import React from "react";
import { MotionProps } from "framer-motion";

type AnimationType = "fadeIn" | "slideUp" | "custom";

export interface ScrollAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  type?: AnimationType;
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  motionProps?: MotionProps;
  customVariants?: any;
}
