"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import { useNavbarStore } from "@/stores";

/**
 * 节流滚动事件处理函数类型（带 cancel 方法）
 */
type ThrottledScrollHandler = ((event: Event) => void) & {
  cancel: () => void;
};

/**
 * 导航栏滚动配置项
 */
const THROTTLE_DELAY = 16; // 约60fps的节流响应

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
    isInitialized,
    setScrollPosition,
    setPageTitle,
    scrollToTop,
    initialize,
  } = useNavbarStore();

  // 初始化 navbar store
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  const handleScroll = useCallback(
    (_: Event) => {
      setScrollPosition(window.scrollY);
    },
    [setScrollPosition]
  );

  const throttledHandleScroll = useMemo(() => {
    let lastCall = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    const throttled = function (this: Window, _: Event) {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall;

      if (timeSinceLastCall >= THROTTLE_DELAY) {
        lastCall = now;
        handleScroll.call(this, _);
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          handleScroll.call(this, _);
        }, THROTTLE_DELAY - timeSinceLastCall);
      }
    } as ThrottledScrollHandler;

    throttled.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    return throttled;
  }, [handleScroll]);

  // 检查当前页面是否应该显示页面标题
  const shouldShowPageTitle = useCallback(() => {
    const pathSegments = pathname.split("/").filter(Boolean);

    // 只在博客详情页和文档详情页显示页面标题
    if (pathSegments[0] === "blog" && pathSegments.length > 1) {
      return true; // 博客详情页: /blog/[...slug]
    }
    if (pathSegments[0] === "docs" && pathSegments.length > 1) {
      return true; // 文档详情页: /docs/[...slug]
    }

    return false;
  }, [pathname]);

  // 设置页面标题
  const updatePageTitle = useCallback(() => {
    // 只在博客详情页和文档详情页设置页面标题
    if (shouldShowPageTitle()) {
      // 使用 setTimeout 确保 DOM 已经渲染完成
      const tryGetTitle = () => {
        const h1Element = document.querySelector("h1");
        if (h1Element) {
          const title = h1Element.textContent?.trim() || "";
          if (title) {
            setPageTitle(title);
            return;
          }
        }

        // 如果没有 h1 或标题为空，根据路径设置默认标题
        const pathSegments = pathname.split("/").filter(Boolean);
        if (pathSegments[0] === "blog" && pathSegments.length > 1) {
          setPageTitle("博客详情");
        } else if (pathSegments[0] === "docs" && pathSegments.length > 1) {
          setPageTitle("文档详情");
        }
      };

      // 立即尝试获取标题
      tryGetTitle();

      // 如果立即获取失败，延迟一点再试（处理动态内容加载的情况）
      setTimeout(tryGetTitle, 100);
    }
    // 注意：其他页面不调用 setPageTitle，保持导航栏原有状态
    // 导航栏组件会根据 shouldShowPageTitle 来决定是否显示页面标题
  }, [pathname, setPageTitle, shouldShowPageTitle]);

  // 监听滚动事件
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized) return;

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      throttledHandleScroll.cancel();
    };
  }, [throttledHandleScroll, isInitialized]);

  // 路径变化时更新标题
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized) return;
    updatePageTitle();
  }, [updatePageTitle, isInitialized]);

  // 监听 DOM 变化，确保动态内容加载后能获取到标题
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized || !shouldShowPageTitle()) return;

    const observer = new MutationObserver(() => {
      updatePageTitle();
    });

    // 监听 main 元素或 body 的子元素变化
    const targetElement = document.querySelector("main") || document.body;
    observer.observe(targetElement, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [updatePageTitle, isInitialized, shouldShowPageTitle]);

  const showNavMenu = useMemo(() => {
    if (!shouldShowPageTitle()) return true; // 非详情页始终显示导航菜单
    return !showTitle; // 当显示标题时，不显示导航菜单
  }, [showTitle, shouldShowPageTitle]);

  return {
    direction,
    position,
    showTitle, // 直接使用store中的showTitle状态
    showNavMenu, // 导航菜单显示状态
    pageTitle,
    lastDirectionChange,
    scrollToTop,
    shouldShowPageTitle: shouldShowPageTitle(),
  } as const;
}
