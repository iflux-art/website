/**
 * 响应式布局 Hook
 */

"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useLayoutStore } from "@/stores";

/**
 * 响应式布局 Hook
 * 使用 Zustand 状态管理，根据窗口大小更新响应式状态
 */
export function useResponsiveLayout() {
  const {
    isMobile,
    isTablet,
    isDesktop,
    updateResponsiveState,
    setIsMobile,
    setIsTablet,
    setIsDesktop,
  } = useLayoutStore();

  // 处理窗口大小变化
  const handleResize = useCallback(() => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;
    updateResponsiveState(width);
  }, [updateResponsiveState]);

  // 初始化响应式状态
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 设置初始状态
    handleResize();

    // 添加事件监听器
    window.addEventListener("resize", handleResize);

    // 清理事件监听器
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // 计算设备类型
  const deviceType = useMemo(() => {
    if (isMobile) return "mobile";
    if (isTablet) return "tablet";
    if (isDesktop) return "desktop";
    return "unknown";
  }, [isMobile, isTablet, isDesktop]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    setIsMobile,
    setIsTablet,
    setIsDesktop,
  };
}
