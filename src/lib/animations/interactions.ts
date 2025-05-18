/**
 * 交互动画定义
 * 提供用户交互相关的动画效果
 */
import { Variants } from "framer-motion";

// 悬停缩放效果
export const hoverScale = {
  scale: 1.05,
};

// 悬停上升效果
export const hoverUp = {
  y: -5,
};

// 按钮点击效果
export const buttonTap = {
  scale: 0.95,
};

// 脉冲动画
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

// 悬停高亮效果
export const hoverHighlight = {
  backgroundColor: "var(--highlight-color, rgba(0, 0, 0, 0.05))",
  transition: { duration: 0.2 },
};

// 点击波纹效果配置
export const rippleEffect = {
  initial: { scale: 0, opacity: 0.5 },
  animate: { scale: 1.5, opacity: 0 },
  transition: { duration: 0.4 },
};

// 悬停旋转效果
export const hoverRotate = {
  rotate: 5,
  transition: { duration: 0.2 },
};

// 抖动效果
export const shake = {
  animate: {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.5 },
  },
};

// 交错容器动画
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// 列表项交错动画
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
};