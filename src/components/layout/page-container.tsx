"use client";

import { useLayoutStore } from "@/stores";
import { getContainerClassName } from "@/lib/layout/layout-utils";
import type { PageContainerProps } from "@/types";
import { cn } from "@/utils";
import { ResponsiveGrid } from "./responsive-grid";
import { useEffect } from "react";

/**
 * 通用页面容器组件
 * 支持三种布局类型：
 * 1. narrow: 窄布局，占中间的6列（友链、关于页面）
 * 2. double-sidebar: 双侧栏布局，左右侧栏各占3列，中间主内容区占6列（博客列表、博客详情、文档详情页、导航页面）
 * 3. full-width: 宽布局，占满全部的12列（首页）
 */
export const PageContainer = ({
  children,
  config = {},
  sidebars = [],
  className = "",
}: PageContainerProps) => {
  const { layout = "full-width" } = config;
  const containerClassName = getContainerClassName(config);

  // 检查是否在客户端环境
  const isClient = typeof window !== "undefined";

  // 始终调用 Zustand store，但在服务端返回默认值
  const store = useLayoutStore();
  const layoutType = isClient ? store.layoutType : layout;
  const storedSidebars = isClient ? store.sidebars : sidebars;

  // 同步 props 到 store，只在客户端且必要时更新
  useEffect(() => {
    if (!(isClient && store)) return;

    const { setLayoutType, setSidebars } = store;

    if (layoutType !== layout) {
      setLayoutType(layout);
    }

    // 比较 sidebars 数组是否相等
    const sidebarsEqual =
      storedSidebars.length === sidebars.length &&
      storedSidebars.every((sb, index) => sb.position === sidebars[index]?.position);

    if (!sidebarsEqual) {
      setSidebars(sidebars);
    }
  }, [isClient, store, layout, sidebars, layoutType, storedSidebars]);

  // 根据布局类型渲染不同的容器
  if (layout === "full-width" && sidebars.length === 0) {
    // 宽布局：适用于首页
    return (
      <div className={cn(containerClassName, "w-full", className)}>
        <div className="container mx-auto px-4 py-4">{children}</div>
      </div>
    );
  }

  // 其他布局类型使用网格布局
  return (
    <div className={cn(containerClassName, className)}>
      <div className="container mx-auto px-4">
        <ResponsiveGrid sidebars={sidebars} layoutType={layout}>
          {children}
        </ResponsiveGrid>
      </div>
    </div>
  );
};

export type { PageContainerProps } from "@/types";

export default PageContainer;
