"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, MotionProps } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { pageTransition } from "@/lib/animations";
import { applyThemeTransition, getStoredTheme, storeTheme, watchSystemTheme } from "@/lib/theme-utils";

/**
 * 页面过渡动画组件属性
 */
export interface PageTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  motionProps?: MotionProps;
}

/**
 * 页面过渡包装组件属性
 */
export interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

/**
 * 主题过渡组件属性
 */
export interface ThemeTransitionProps {
  children: React.ReactNode;
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

/**
 * 页面过渡包装组件
 * 
 * 为页面切换提供平滑的过渡动画效果
 * 使用 AnimatePresence 和 motion 组件实现
 */
export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname();
  const [isFirstRender, setIsFirstRender] = useState(true);

  // 在组件挂载后标记为非首次渲染
  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={isFirstRender ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * 应用级页面过渡组件
 * 为整个应用提供平滑的页面切换动画
 * 使用方法：在根布局文件中包裹内容
 */
export function AppPageTransition({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname();

  // 滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * 主题切换过渡动画组件
 * 为整个应用提供平滑的主题切换过渡效果
 *
 * 增强功能：
 * - 平滑的主题切换动画
 * - 主题持久化到 localStorage
 * - 系统主题变化监听
 */
export function ThemeTransition({ children }: ThemeTransitionProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [prevTheme, setPrevTheme] = useState<string | undefined>(undefined);
  const [transitioning, setTransitioning] = useState(false);

  // 初始化主题
  useEffect(() => {
    // 确保 theme 和 setTheme 存在
    if (!theme || !setTheme) return;

    // 从 localStorage 恢复主题，但默认使用系统主题
    const storedTheme = getStoredTheme();

    // 只有当存储的主题存在且与当前主题不同时才设置
    // 这允许用户保留他们之前选择的主题
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
    // 注意：我们不再强制设置为系统主题
    // 默认情况下，next-themes 会使用 defaultTheme="system"
  }, [theme, setTheme]);

  // 监听主题变化
  useEffect(() => {
    // 确保 resolvedTheme 存在
    if (!resolvedTheme) return;

    // 只有当解析后的主题实际变化时才应用过渡效果
    if (prevTheme && prevTheme !== resolvedTheme) {
      // 应用主题过渡效果 - 只影响颜色相关的CSS属性
      applyThemeTransition();

      // 显示过渡动画 - 只是一个轻量级的覆盖层
      setTransitioning(true);

      // 存储主题到 localStorage - 不影响渲染
      // 存储用户选择的主题，无论是什么主题
      if (theme) {
        storeTheme(theme);
      }

      // 短暂延迟后结束过渡状态
      const timer = setTimeout(() => {
        setTransitioning(false);
      }, 300); // 与动画持续时间匹配

      return () => clearTimeout(timer);
    }

    if (resolvedTheme) {
      setPrevTheme(resolvedTheme);
    }
  }, [resolvedTheme, prevTheme, theme, setTheme]);

  // 监听系统主题变化
  useEffect(() => {
    // 确保 theme 存在
    if (!theme) return;

    // 如果当前使用系统主题，则监听系统主题变化
    if (theme === 'system') {
      return watchSystemTheme((newSystemTheme) => {
        // 使用 requestAnimationFrame 确保在下一帧应用过渡效果
        requestAnimationFrame(() => {
          // 系统主题变化时应用过渡效果
          applyThemeTransition();
          setTransitioning(true);

          // 短暂延迟后结束过渡状态
          setTimeout(() => {
            setTransitioning(false);
          }, 300);
        });
      });
    }
  }, [theme]);

  return (
    <>
      {/* 页面内容 */}
      {children}
    </>
  );
}
