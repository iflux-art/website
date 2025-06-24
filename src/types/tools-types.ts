/**
 * 工具相关类型定义
 */

import { LoadingState, ID } from './common';

/**
 * 工具状态接口
 */
export interface ToolState extends LoadingState {
  /** 输入内容 */
  input: string;
  /** 输出内容 */
  output: string;
  /** 是否正在处理 */
  isProcessing?: boolean;
  /** 处理进度 (0-100) */
  progress?: number;
}

/**
 * 工具动作接口
 */
export interface ToolActions {
  /** 设置输入内容 */
  setInput: (value: string) => void;
  /** 设置输出内容 */
  setOutput: (value: string) => void;
  /** 设置错误信息 */
  setError: (value: string) => void;
  /** 设置加载状态 */
  setLoading: (value: boolean) => void;
  /** 清空所有状态 */
  clearAll: () => void;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 工具配置接口
 */
export interface ToolConfig {
  /** 工具ID */
  id: ID;
  /** 工具名称 */
  name: string;
  /** 工具描述 */
  description?: string;
  /** 输入占位符 */
  placeholder?: string;
  /** 初始输入值 */
  defaultInput?: string;
  /** 工具分类 */
  category?: string;
  /** 工具标签 */
  tags?: string[];
  /** 是否为特色工具 */
  featured?: boolean;
  /** 工具图标 */
  icon?: string;
}
