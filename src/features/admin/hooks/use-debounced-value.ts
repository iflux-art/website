import { useEffect, useState } from "react";

/**
 * 防抖值 Hook
 * 用于延迟更新值，避免频繁变化触发不必要的重渲染
 *
 * @template T 值的类型
 * @param value 需要防抖的值
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的值
 *
 * @example
 * ```typescript
 * const [inputValue, setInputValue] = useState("");
 * const debouncedValue = useDebouncedValue(inputValue, 300);
 * ```
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  /** 防抖后的值状态 */
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    /** 延迟定时器 */
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：组件卸载或值变化时清除定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
