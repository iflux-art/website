/**
 * search 组件类型定义
 */

import { ReactNode } from "react";

/**
 * 搜索按钮组件属性
 */
export interface SearchButtonProps {
  /**
   * 点击按钮时的回调函数
   */
  onClick: () => void;
}

/**
 * 搜索对话框组件属性
 * 目前不需要任何属性，但保留此接口以便将来扩展
 */
export interface SearchDialogProps {}
