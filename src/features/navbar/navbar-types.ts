import type { ComponentType, ReactNode } from "react";

/** 基础导航项 */
export interface BaseNavItem {
  /** 导航项标识 */
  key: string;
  /** 显示标签 */
  label: string;
  /** 链接地址 */
  href?: string;
  /** 图标 */
  icon?: ComponentType<{ className?: string }> | ReactNode;
  /** 是否为外部链接 */
  external?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
}
