/**
 * 工具相关类型定义
 */

/**
 * 工具状态接口
 */
export interface ToolState {
  /** 输入内容 */
  input: string;
  /** 输出内容 */
  output: string;
  /** 错误信息 */
  error: string;
  /** 加载状态 */
  isLoading: boolean;
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
  id: string;
  /** 工具名称 */
  name: string;
  /** 工具描述 */
  description?: string;
  /** 输入占位符 */
  placeholder?: string;
  /** 初始输入值 */
  defaultInput?: string;
}
