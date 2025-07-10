import { useState, useMemo, useCallback, useEffect } from "react";
import type { MDXOptions } from "@/types";
import { debounce } from "@/lib/utils/helpers";
import { MDX_CONFIG } from "@/config/mdx-config";

type MDXComponents = NonNullable<MDXOptions["components"]>;
type DebouncedFunction<T> = T & { cancel: () => void };

interface UseMDXOptions {
  initialContent?: string;
  debounceDelay?: number;
  components?: MDXComponents;
}

/**
 * MDX 内容管理 Hook
 * 提供内容管理和更新功能
 */
export function useMDX({
  initialContent = "",
  debounceDelay = MDX_CONFIG.DEBOUNCE_DELAY,
  components = {},
}: UseMDXOptions = {}) {
  // 内容状态管理
  const [content, setContent] = useState(initialContent);

  // 缓存自定义组件
  const customComponents = useMemo(() => components, [components]);

  // 创建防抖函数
  const debouncedFn = useMemo(
    () =>
      debounce((value: string) => {
        setContent(value);
        return Promise.resolve();
      }, debounceDelay) as DebouncedFunction<(value: string) => Promise<void>>,
    [debounceDelay, setContent],
  );

  // 清理防抖函数
  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  // 更新内容的防抖函数
  const debouncedSetContent = useCallback(
    (value: string) => {
      return debouncedFn(value);
    },
    [debouncedFn],
  );

  return {
    content,
    setContent: debouncedSetContent,
    components: customComponents,
  };
}
