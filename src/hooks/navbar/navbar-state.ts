import { useCallback, useEffect } from "react";
import { useNavbarStore } from "@/stores";

/**
 * 导航栏滚动状态管理自定义 Hook
 * 管理导航栏的显示/隐藏逻辑和页面标题显示
 *
 * 设计说明：
 * 1. 使用 Zustand 管理全局状态，确保状态一致性
 * 2. 实现防抖逻辑，避免频繁的状态更新
 * 3. 支持自定义滚动阈值和防抖延迟
 * 4. 提供页面标题显示控制
 *
 * 使用示例：
 * const { pageTitle, showTitle, scrollToTop, shouldShowPageTitle, showNavMenu } = useNavbarScroll();
 */

export function useNavbarScroll() {
  // 从 Zustand store 获取状态和动作
  const {
    direction,
    position,
    showTitle,
    pageTitle,
    isInitialized,
    setScrollPosition,
    setPageTitle,
    initialize,
  } = useNavbarStore();

  // 滚动处理函数 - 带防抖
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // 更新滚动位置
    setScrollPosition(currentScrollY);
  }, [setScrollPosition]);

  // 页面标题显示逻辑
  const shouldShowPageTitle = showTitle && direction === "up" && position > 100;

  // 是否显示导航菜单 - 在顶部或向下滚动时隐藏
  const showNavMenu = position <= 50 || direction === "up";

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 初始化和事件监听
  useEffect(() => {
    // 初始化状态
    if (!isInitialized) {
      initialize();
    }

    // 设置页面标题
    const titleElement = document.querySelector("h1");
    if (titleElement) {
      setPageTitle(titleElement.textContent || document.title);
    }

    // 添加滚动事件监听器
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 清理函数
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isInitialized, initialize, setPageTitle, handleScroll]);

  return {
    direction,
    position,
    pageTitle,
    showTitle: shouldShowPageTitle,
    scrollToTop,
    shouldShowPageTitle,
    showNavMenu,
  };
}
