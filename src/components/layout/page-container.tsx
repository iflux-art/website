"use client";

import { useLayoutStore } from "@/stores";
import { getContainerClassName } from "@/lib/layout/layout-utils";
import type { PageContainerProps } from "@/types";
import { cn } from "@/utils";
import { ThreeColumnGrid } from "./three-column-grid";
import { useEffect } from "react";

/**
 * 通用页面容器组件
 * 支持两种布局类型：
 * 1. three-column: 导航、博客列表/详情页、文档详情页的3栏布局
 * 2. full-width: 首页、友链、关于和管理后台的全屏内容区
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

  // 全屏布局：适用于首页、友链、关于和管理后台
  if (layout === "full-width") {
    return (
      <div className={cn(containerClassName, "w-full", className)}>
        <div className="container mx-auto px-4 py-4">{children}</div>
      </div>
    );
  }

  // 三栏布局：适用于导航、博客列表/详情页、文档详情页
  if (layout === "three-column" && sidebars.length > 0) {
    return (
      <div className={cn(containerClassName, className)}>
        <div className="container mx-auto px-4">
          <ThreeColumnGrid sidebars={sidebars}>{children}</ThreeColumnGrid>
        </div>
      </div>
    );
  }

  // 回退到全屏布局
  return (
    <div className={cn(containerClassName, "w-full", className)}>
      <div className="container mx-auto px-4 py-4">{children}</div>
    </div>
  );
};

export type { PageContainerProps } from "@/types";

export default PageContainer;
