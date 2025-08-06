/**
 * 基础类型定义
 * 包含基础值类型、组件类型和工具类型
 */

import type { ReactNode, CSSProperties } from "react";

// ==================== 基础值类型 ====================

/** URL 类型 */
export type URL = string;

/** 颜色值类型 */
export type Color = string;

// ==================== 基础组件类型 ====================

/** 基础组件属性 */
export interface BaseComponentProps {
  /** 子元素 */
  children?: ReactNode;
  /** CSS 类名 */
  className?: string;
  /** 元素 ID */
  id?: string;
  /** 内联样式 */
  style?: CSSProperties;
}

/** 可点击组件属性 */
export interface ClickableProps extends BaseComponentProps {
  /** 点击事件处理函数 */
  onClick?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
}

/** 表单组件属性 */
export interface FormComponentProps extends BaseComponentProps {
  /** 表单字段名称 */
  name?: string;
  /** 是否必填 */
  required?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 占位符文本 */
  placeholder?: string;
}

// ==================== 工具类型 ====================

/** 深度只读类型 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/** 可选字段类型 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** 必需字段类型 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** 非空类型 */
export type NonNullable<T> = T extends null | undefined ? never : T;

// ==================== 导航相关类型 ====================

/** 面包屑导航项 */
export interface BreadcrumbItem {
  /** 显示的标签文本 */
  label: string;
  /** 链接地址，如果不提供则显示为纯文本 */
  href?: string;
}
