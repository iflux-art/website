"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 主题图标动画组件属性
 */
interface ThemeIconAnimationProps {
  /**
   * 当前主题
   */
  theme: string | undefined;

  /**
   * 是否正在动画中
   */
  isAnimating: boolean;

  /**
   * 图标元素
   */
  icon: React.ReactNode;
}

/**
 * 主题图标动画组件
 *
 * 使用 React.memo 优化性能，避免不必要的重新渲染
 */
export const ThemeIconAnimation = React.memo(
  function ThemeIconAnimation({ theme, isAnimating, icon }: ThemeIconAnimationProps) {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme || "system"}
          initial={{ rotate: 0 }}
          animate={{
            rotate: 360
          }}
          exit={{
            rotate: 360
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            rotate: { duration: 0.3 }
          }}
          className="flex items-center justify-center"
          style={{
            willChange: 'transform',
            transformOrigin: 'center'
          }}
        >
          {icon}
        </motion.div>
      </AnimatePresence>
    );
  },
  // 自定义比较函数，只有当主题或动画状态变化时才重新渲染
  (prevProps, nextProps) => {
    return (
      prevProps.theme === nextProps.theme &&
      prevProps.isAnimating === nextProps.isAnimating
    );
  }
);
