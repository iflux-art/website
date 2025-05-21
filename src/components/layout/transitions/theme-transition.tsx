"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { applyThemeTransition, getStoredTheme, storeTheme, watchSystemTheme } from "@/lib/theme-utils";

/**
 * 主题切换过渡动画组件
 * 为整个应用提供平滑的主题切换过渡效果
 *
 * 增强功能：
 * - 平滑的主题切换动画
 * - 主题持久化到 localStorage
 * - 系统主题变化监听
 */
export function ThemeTransition({
  children,
}: {
  children: React.ReactNode;
}) {
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
