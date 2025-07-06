"use client";

import { useEffect, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ThrottledScrollHandler } from "@/types";

function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number,
): T & { cancel: () => void } {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      fn(...args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, delay - timeSinceLastCall);
    }
  }) as T;

  (throttled as T & { cancel: () => void }).cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttled as T & { cancel: () => void };
}
import { useSafeNavbar } from "@/hooks/use-safe-state";

const THROTTLE_DELAY = 50; // 更快的节流响应

/**
 * 导航栏滚动效果 Hook
 *
 * 使用 Zustand 状态管理，根据页面滚动行为控制导航栏的显示状态：
 * - 监听滚动方向，自动切换导航栏显示状态
 * - 动态获取并显示当前页面标题
 * - 提供回到顶部功能
 *
 * @returns 返回导航栏状态和控制函数对象
 */
export function useNavbarScroll() {
  const pathname = usePathname();
  const {
    direction,
    position,
    showTitle,
    pageTitle,
    lastDirectionChange,
    setScrollPosition,
    setPageTitle,
    scrollToTop,
  } = useSafeNavbar();

  const handleScroll = useCallback(
    function (this: Window, _: Event) {
      setScrollPosition(window.scrollY);
    },
    [setScrollPosition],
  );

  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, THROTTLE_DELAY) as ThrottledScrollHandler,
    [handleScroll],
  );

  // 设置页面标题
  const updatePageTitle = useCallback(() => {
    // 立即获取标题
    const h1Element = document.querySelector("h1");
    if (h1Element) {
      setPageTitle(h1Element.textContent?.trim() || "");
    } else {
      // 如果没有 h1，根据路径设置默认标题
      const pathSegments = pathname.split("/").filter(Boolean);
      const titleMap: { [key: string]: string } = {
        "": "首页",
        docs: pathSegments.length === 1 ? "文档中心" : "文档详情",
        blog: pathSegments.length === 1 ? "博客列表" : "博客详情",
        journal: pathSegments.length === 1 ? "日志归档" : "日志详情",
        admin: "管理中心",
        tools: pathSegments.length === 1 ? "工具箱" : "工具详情",
        links: "网址导航",
      };
      setPageTitle(titleMap[pathSegments[0]] || "页面");
    }
  }, [pathname, setPageTitle]);

  // 监听滚动事件
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      throttledHandleScroll.cancel();
    };
  }, [throttledHandleScroll]);

  // 路径变化时更新标题
  useEffect(() => {
    if (typeof window === "undefined") return;
    updatePageTitle();
  }, [updatePageTitle]);

  return {
    direction,
    position,
    showTitle,
    pageTitle,
    lastDirectionChange,
    scrollToTop,
  } as const;
}
