/**
 * 动画工具库 - 提供全局一致的动画效果
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

// 页面切换动画
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
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

// 滚动显示动画（从下方滑入）
export const scrollRevealUp: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// 交错容器动画
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// 交错子项动画
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// 卡片悬停效果
export const cardHover = {
  scale: 1.03,
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  transition: {
    duration: 0.3
  }
};

// 图标旋转动画
export const iconSpin = {
  rotate: 360,
  transition: {
    duration: 0.5,
    ease: "easeInOut"
  }
};

// Logo动画效果
export const logoAnimation: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
};