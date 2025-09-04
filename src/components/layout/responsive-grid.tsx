import type { ReactNode } from "react";
import type { SidebarConfig } from "@/types";
import type { PageLayoutType } from "@/types";
import { cn } from "@/utils";
import { SidebarWrapper } from "@/features/navigation";
import { getMainContentClasses, getSidebarClasses } from "@/lib/layout/layout-utils";
import { useLayoutStore } from "@/stores";

interface ResponsiveGridProps {
  /**
   * 网格内容
   */
  children: ReactNode;
  /**
   * 侧边栏配置
   */
  sidebars: SidebarConfig[];
  /**
   * 手动指定布局类型（可选）
   */
  layoutType?: PageLayoutType;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 响应式网格布局组件
 * 支持三种布局类型：
 * 1. 窄布局(narrow)：主内容占8列
 * 2. 双侧栏布局(double-sidebar)：左右侧栏各占2列，主内容占8列
 * 3. 宽布局(full-width)：主内容占满12列
 */
export const ResponsiveGrid = ({
  children,
  sidebars,
  layoutType: propLayoutType,
  className = "",
}: ResponsiveGridProps) => {
  const { layoutType: storeLayoutType } = useLayoutStore();

  // 优先使用传入的布局类型，否则使用 store 中的类型
  const layoutType = propLayoutType || storeLayoutType;

  const leftSidebars = sidebars.filter(s => s.position === "left");
  const rightSidebars = sidebars.filter(s => s.position === "right");

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12 md:gap-6 lg:gap-8 xl:gap-10",
        layoutType === "narrow" ? "py-4 lg:py-6" : "py-6 lg:py-8",
        className
      )}
    >
      {/* 左侧边栏区域 */}
      {leftSidebars.length > 0 && (
        <div className={getSidebarClasses("left", layoutType)}>
          {leftSidebars.map((sidebar, index) => (
            <SidebarWrapper key={sidebar.id || `left-${index}`} config={sidebar}>
              {sidebar.content}
            </SidebarWrapper>
          ))}
        </div>
      )}

      {/* 主内容区域 */}
      <main className={getMainContentClasses(layoutType)}>{children}</main>

      {/* 右侧边栏区域 */}
      {rightSidebars.length > 0 && (
        <div className={getSidebarClasses("right", layoutType)}>
          {rightSidebars.map((sidebar, index) => (
            <SidebarWrapper key={sidebar.id || `right-${index}`} config={sidebar}>
              {sidebar.content}
            </SidebarWrapper>
          ))}
        </div>
      )}
    </div>
  );
};

// 为了向后兼容，保留ThreeColumnGrid的导出
export const ThreeColumnGrid = ResponsiveGrid;
