import type { ThreeColumnGridProps } from "@/types";
import { cn } from "@/utils";
export type { ThreeColumnGridProps } from "@/types";
import { SidebarWrapper } from "@/features/navigation";
import { getMainContentClasses, getSidebarClasses } from "@/lib/layout/layout-utils";
import { useLayoutStore } from "@/stores";

/**
 * 三栏网格布局组件
 * 支持三种布局类型：
 * 1. 窄布局(narrow)：主内容占6列，不显示侧边栏
 * 2. 双侧栏布局(double-sidebar)：左右侧栏各占3列，主内容占6列
 * 3. 宽布局(full-width)：主内容占满12列，不显示侧边栏
 */
export const ThreeColumnGrid = ({ children, sidebars }: ThreeColumnGridProps) => {
  const { layoutType } = useLayoutStore();

  const leftSidebars = sidebars.filter(s => s.position === "left");
  const rightSidebars = sidebars.filter(s => s.position === "right");

  return (
    <div className="grid grid-cols-1 gap-4 py-6 sm:gap-6 md:grid-cols-12 md:gap-6 lg:gap-8 lg:py-8 xl:gap-10">
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
      <main className={cn(getMainContentClasses(layoutType))}>{children}</main>

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
