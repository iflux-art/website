/**
 * Layout 功能模块统一导出
 */

// 组件导出
export {
  PageContainer,
  ThreeColumnLayout,
  ThreeColumnGrid,
  SidebarWrapper,
  AppGrid,
  Footer,
  Sidebar,
  Breadcrumb,
  Loading,
  NotFound,
  ThemeToggle,
  GitHubButton,
  TravelButton,
} from './components';

// 类型导出
export type {
  SidebarItem,
  SidebarProps,
  // 页面容器相关类型
  AppGridProps,
  PageContainerProps,
  ThreeColumnLayoutProps,
  ThreeColumnGridProps,
  SidebarWrapperProps,
  GridColsMap,
  GridGapMap,
} from './types';

// 工具函数导出
export {
  gridColsMap,
  gridGapMap,
  getResponsiveClasses,
  getMainContentClasses,
  getSidebarClasses,
  DEFAULT_SIDEBAR_CONFIG,
  THREE_COLUMN_LAYOUT_CONFIG,
} from './lib';

// Navbar 子模块导出
export {
  MainNavbar,
  Logo,
  NavListMenu,
  HamburgerMenu,
  NavItem,
  NavItemList,
  NavLink,
  ActiveLink,
} from './navbar';
