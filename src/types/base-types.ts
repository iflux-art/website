/**
 * 基础类型定义
 *
 * 包含基础值类型和组件类型，为整个应用提供通用的类型定义。
 * 这些类型被广泛用于组件开发和数据处理中。
 *
 * 类型分类：
 * - 基础值类型：URL、Color 等
 * - 基础组件类型：BaseComponentProps、ClickableProps 等
 *
 * @author 系统重构
 * @since 2024
 */

import type { ReactNode, CSSProperties } from 'react';

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
