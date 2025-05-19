/**
 * page-transition 组件类型定义
 */

import React from "react";
import { MotionProps } from "framer-motion";

export interface PageTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  motionProps?: MotionProps;
}
