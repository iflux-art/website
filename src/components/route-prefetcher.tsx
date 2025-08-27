"use client";

import { useRoutePrefetch } from "@/hooks/use-route-prefetch";
import { useEffect } from "react";

interface RoutePrefetcherProps {
  /** 要预取的路由列表 */
  routes: string[];
  /** 预取策略 */
  strategy?: "mount" | "idle" | "hover";
}

/**
 * 路由预取器组件
 * 用于在特定时机预取路由以提高导航性能
 */
export const RoutePrefetcher = ({ routes, strategy = "idle" }: RoutePrefetcherProps) => {
  const { prefetchAllRoutes } = useRoutePrefetch(routes, {
    prefetchOnMount: strategy === "mount",
    prefetchOnIdle: strategy === "idle",
  });

  // 根据策略执行预取
  useEffect(() => {
    if (strategy === "mount") {
      prefetchAllRoutes();
    } else if (strategy === "idle") {
      // 预取将在 useRoutePrefetch 中的 useEffect 中处理
    }
  }, [strategy, prefetchAllRoutes]);

  return null;
};
