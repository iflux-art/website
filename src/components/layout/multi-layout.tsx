import type { ReactNode } from "react";
import type { PageLayoutType, SidebarConfig } from "@/types";
import { THREE_COLUMN_LAYOUT_CONFIG } from "@/lib/layout/layout-utils";
import { PageContainer } from "./page-container";

interface MultiLayoutProps {
  /**
   * 左侧边栏内容
   */
  leftSidebar?: ReactNode;
  /**
   * 主内容
   */
  children: ReactNode;
  /**
   * 右侧边栏内容
   */
  rightSidebar?: ReactNode;
  /**
   * 布局类型
   */
  layout?: PageLayoutType;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 多布局组件
 * 提供三种不同的布局选项:
 *
 * 1. narrow: 窄布局，占中间的6列（友链、关于页面）
 * 2. double-sidebar: 双侧栏布局，左右侧栏各占3列，中间主内容区占6列（博客列表、博客详情、文档详情页、导航页面）
 * 3. full-width: 宽布局，占满全部的12列（首页）
 */
export const MultiLayout = ({
  leftSidebar,
  children,
  rightSidebar,
  layout = "double-sidebar",
  className = "",
}: MultiLayoutProps) => {
  const sidebars: SidebarConfig[] = [];

  // 左侧边栏配置 - 只在双侧栏布局中添加
  if (leftSidebar && layout === "double-sidebar") {
    sidebars.push({
      content: leftSidebar,
      position: "left",
      ...THREE_COLUMN_LAYOUT_CONFIG.leftSidebar,
    });
  }

  // 右侧边栏配置 - 只在双侧栏布局中添加
  if (rightSidebar && layout === "double-sidebar") {
    sidebars.push({
      content: rightSidebar,
      position: "right",
      ...THREE_COLUMN_LAYOUT_CONFIG.rightSidebar,
    });
  }

  return (
    <PageContainer config={{ layout }} sidebars={sidebars} className={className}>
      {children}
    </PageContainer>
  );
};

// 为了向后兼容，保留ThreeColumnLayout的导出
export const ThreeColumnLayout = MultiLayout;
