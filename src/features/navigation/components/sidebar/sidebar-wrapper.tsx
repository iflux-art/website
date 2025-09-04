import { DEFAULT_SIDEBAR_CONFIG, getResponsiveClasses } from "@/lib/layout/layout-utils";
import type { SidebarWrapperProps } from "@/features/navigation/types";
import { cn } from "@/utils";

/**
 * 侧边栏包装组件
 * 处理粘性定位和响应式显示
 */
export const SidebarWrapper = ({ children, config }: SidebarWrapperProps) => {
  const {
    sticky = DEFAULT_SIDEBAR_CONFIG.sticky,
    stickyTop = DEFAULT_SIDEBAR_CONFIG.stickyTop,
    maxHeight = DEFAULT_SIDEBAR_CONFIG.maxHeight,
    responsive = DEFAULT_SIDEBAR_CONFIG.responsive,
  } = config;

  const {
    hideOnMobile = DEFAULT_SIDEBAR_CONFIG.responsive.hideOnMobile,
    hideOnTablet = DEFAULT_SIDEBAR_CONFIG.responsive.hideOnTablet,
    hideOnDesktop = DEFAULT_SIDEBAR_CONFIG.responsive.hideOnDesktop,
  } = responsive;

  const sidebarClasses = cn(
    "hide-scrollbar overflow-y-auto",
    sticky && "sticky",
    getResponsiveClasses(hideOnMobile, hideOnTablet, hideOnDesktop)
  );

  const sidebarStyle = sticky
    ? {
        top: stickyTop,
        maxHeight,
      }
    : {
        maxHeight,
      };

  return (
    <aside className={sidebarClasses} style={sidebarStyle}>
      <div className="space-y-4">{children}</div>
    </aside>
  );
};
