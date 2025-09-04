/**
 * Navbar 功能模块统一导出
 */

// 组件导出
export {
  Logo,
  MainNavbar,
  NavItem,
  NavItemList,
  NavLink,
  ActiveLink,
  NavListMenu,
  HamburgerMenu,
  NavCardMenu,
} from "./components";

// Hooks 导出
export { useNavbarScroll, useActiveSection } from "./hooks";

// 类型导出
export type {
  BreadcrumbItem,
  Heading,
  SidebarItem,
  SidebarProps,
  BaseNavItem,
  NestedNavItem,
  BaseSearchResult,
  NavbarSearchResult,
} from "./types";

// 配置和类型导出
export { NAV_ITEMS, NAV_PATHS, NAV_DESCRIPTIONS } from "./components/nav-config";
export type { NavConfigItem } from "./components/nav-config";
