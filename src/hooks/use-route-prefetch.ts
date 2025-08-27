"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";

interface UseRoutePrefetchOptions {
  /** 预取延迟时间（毫秒） */
  prefetchDelay?: number;
  /** 是否在组件挂载时立即预取 */
  prefetchOnMount?: boolean;
  /** 是否在空闲时预取 */
  prefetchOnIdle?: boolean;
}

/**
 * 用于管理路由预取的Hook
 *
 * @param routes - 要预取的路由数组
 * @param options - 配置选项
 */
export function useRoutePrefetch(routes: string[], options: UseRoutePrefetchOptions = {}) {
  const router = useRouter();
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  const { prefetchDelay = 0, prefetchOnMount = false, prefetchOnIdle = true } = options;

  // 预取路由
  const prefetchRoute = useCallback(
    (route: string) => {
      if (prefetchedRoutes.current.has(route)) return;

      try {
        router.prefetch(route);
        prefetchedRoutes.current.add(route);
      } catch (error) {
        console.warn(`Failed to prefetch route: ${route}`, error);
      }
    },
    [router]
  );

  // 延迟预取路由
  const prefetchRouteWithDelay = useCallback(
    (route: string, delay: number = prefetchDelay) => {
      if (delay > 0) {
        setTimeout(() => {
          prefetchRoute(route);
        }, delay);
      } else {
        prefetchRoute(route);
      }
    },
    [prefetchDelay, prefetchRoute]
  );

  // 预取所有路由
  const prefetchAllRoutes = useCallback(() => {
    routes.forEach(route => {
      prefetchRouteWithDelay(route);
    });
  }, [routes, prefetchRouteWithDelay]);

  // 在组件挂载时预取
  useEffect(() => {
    if (prefetchOnMount) {
      prefetchAllRoutes();
    }
  }, [prefetchOnMount, prefetchAllRoutes]);

  // 在空闲时预取
  useEffect(() => {
    if (prefetchOnIdle && typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleCallback = window.requestIdleCallback(() => {
        prefetchAllRoutes();
      });

      return () => {
        window.cancelIdleCallback(idleCallback);
      };
    } else if (prefetchOnIdle) {
      // 如果不支持 requestIdleCallback，使用 setTimeout 作为备选
      const timeout = setTimeout(() => {
        prefetchAllRoutes();
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
    // 默认返回空的清理函数
    return () => {};
  }, [prefetchOnIdle, prefetchAllRoutes]);

  return {
    prefetchRoute,
    prefetchRouteWithDelay,
    prefetchAllRoutes,
  };
}
