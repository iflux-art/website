import type { SidebarConfig, ThreeColumnLayoutProps } from "@/types";
export type { ThreeColumnLayoutProps, SidebarConfig } from "@/types";
import { THREE_COLUMN_LAYOUT_CONFIG } from "@/lib/layout/layout-utils";
import { PageContainer } from "./page-container";

/**
 * 简化的三栏布局组件
 * 快速创建左侧边栏 + 主内容 + 右侧边栏的布局
 *
 * 使用场景：
 * - 导航页面：左侧导航 + 主内容 + 右侧目录
 * - 博客列表页：左侧分类 + 主内容 + 右侧推荐
 * - 博客详情页：左侧目录 + 主内容 + 右侧推荐
 * - 文档详情页：左侧导航 + 主内容 + 右侧目录
 */
export const ThreeColumnLayout = ({
  leftSidebar,
  children,
  rightSidebar,
  className = "",
}: ThreeColumnLayoutProps) => {
  const sidebars: SidebarConfig[] = [];

  // 左侧边栏配置
  if (leftSidebar) {
    sidebars.push({
      content: leftSidebar,
      position: "left",
      ...THREE_COLUMN_LAYOUT_CONFIG.leftSidebar,
    });
  }

  // 右侧边栏配置
  if (rightSidebar) {
    sidebars.push({
      content: rightSidebar,
      position: "right",
      ...THREE_COLUMN_LAYOUT_CONFIG.rightSidebar,
    });
  }

  return (
    <PageContainer config={{ layout: "three-column" }} sidebars={sidebars} className={className}>
      {children}
    </PageContainer>
  );
};
