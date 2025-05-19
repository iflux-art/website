/**
 * animation-sequence 组件类型定义
 */

import React from "react";
import { Variants } from "framer-motion";

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
