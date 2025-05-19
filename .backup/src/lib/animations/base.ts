/**
 * 基础动画定义
 * 提供动画的基础配置和简单动画效果
 */
import { Variants } from "framer-motion";

// 基础过渡动画配置
export const baseTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

// 弹性过渡动画配置
export const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
  mass: 1,
};

// 淡入动画
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

// 从下方滑入
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// 从上方滑入
export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
};

// 从左侧滑入
export const slideRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

// 缩放动画
export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// 弹性缩放动画
export const bounceScale: Variants = {
  initial: { scale: 0.9 },
  animate: { scale: 1 },
};