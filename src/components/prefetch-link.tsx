"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";

interface PrefetchLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 链接地址 */
  href: string;
  /** 子元素 */
  children: React.ReactNode;
  /** 预取策略 */
  prefetchStrategy?: "hover" | "mount" | "idle";
  /** 预取延迟时间（毫秒） */
  prefetchDelay?: number;
}

/**
 * 带预取功能的链接组件
 * 在特定时机预取路由以提高导航性能
 */
export const PrefetchLink = ({
  href,
  children,
  prefetchStrategy = "hover",
  prefetchDelay = 0,
  ...props
}: PrefetchLinkProps) => {
  const router = useRouter();
  const prefetchTimeout = useRef<NodeJS.Timeout | null>(null);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (prefetchTimeout.current) {
        clearTimeout(prefetchTimeout.current);
      }
    };
  }, []);

  // 预取路由
  const prefetchRoute = useCallback(() => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }

    prefetchTimeout.current = setTimeout(() => {
      try {
        router.prefetch(href);
      } catch (error) {
        console.warn(`Failed to prefetch route: ${href}`, error);
      }
    }, prefetchDelay);
  }, [href, prefetchDelay, router]);

  // 处理鼠标进入事件
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefetchStrategy === "hover") {
      prefetchRoute();
    }
    props.onMouseEnter?.(e);
  };

  // 处理焦点事件
  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    if (prefetchStrategy === "hover") {
      prefetchRoute();
    }
    props.onFocus?.(e);
  };

  // 在组件挂载时预取
  useEffect(() => {
    if (prefetchStrategy === "mount") {
      prefetchRoute();
      return () => {};
    } else if (
      prefetchStrategy === "idle" &&
      typeof window !== "undefined" &&
      "requestIdleCallback" in window
    ) {
      const idleCallback = window.requestIdleCallback(() => {
        prefetchRoute();
      });

      return () => {
        window.cancelIdleCallback(idleCallback);
      };
    } else if (prefetchStrategy === "idle") {
      // 如果不支持 requestIdleCallback，使用 setTimeout 作为备选
      const timeout = setTimeout(() => {
        prefetchRoute();
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
    // 默认返回空的清理函数
    return () => {};
  }, [prefetchStrategy, prefetchRoute]);

  return (
    <Link href={href} onMouseEnter={handleMouseEnter} onFocus={handleFocus} {...props}>
      {children}
    </Link>
  );
};
