import type { SidebarConfig, ThreeColumnLayoutProps, PageLayoutType } from "@/types";
export type { ThreeColumnLayoutProps, SidebarConfig } from "@/types";
import { THREE_COLUMN_LAYOUT_CONFIG } from "@/lib/layout/layout-utils";
import { PageContainer } from "./page-container";

/**
 * 简化的三栏布局组件
 * 快速创建不同布局类型的页面容器
 *
 * 使用场景：
 * - 导航页面：双侧栏布局（左侧导航 + 主内容 + 右侧目录）
 * - 博客列表页：双侧栏布局（左侧分类 + 主内容 + 右侧推荐）
 * - 博客详情页：双侧栏布局（左侧目录 + 主内容 + 右侧推荐）
 * - 文档详情页：双侧栏布局（左侧导航 + 主内容 + 右侧目录）
 * - 后台管理系统：单侧栏布局（左侧菜单 + 主内容）
 * - 首页：宽布局（主内容占满全屏）
 * - 友链、关于页面：窄布局（主内容居中显示）
 */
export const ThreeColumnLayout = ({
  leftSidebar,
  children,
  rightSidebar,
  className = "",
  layout = "double-sidebar", // 默认使用双侧栏布局
}: ThreeColumnLayoutProps & { layout?: PageLayoutType }) => {
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
    <PageContainer config={{ layout }} sidebars={sidebars} className={className}>
      {children}
    </PageContainer>
  );
};
