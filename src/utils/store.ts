/**
 * Store 工具函数
 *
 * 提供 Zustand store 相关的通用工具函数
 */

/**
 * 创建标准化的重置函数
 *
 * @template T - 状态类型
 * @param initialState - 初始状态
 * @returns 重置函数
 */
export const createResetFunction = <T>(initialState: T) => {
  return () => initialState;
};
