import { useEffect, useState } from "react";

/**
 * 用于避免 SSR 水合错误的 Hook
 *
 * 在服务器端渲染时返回 false，客户端挂载后返回 true
 * 适用于包含随机生成 ID 或客户端专有逻辑的组件
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMounted = useMounted();
 *
 *   if (!isMounted) {
 *     return <div>Loading...</div>; // 服务器端渲染的备用内容
 *   }
 *
 *   return <ClientOnlyComponent />; // 客户端专有组件
 * }
 * ```
 *
 * @returns boolean - 组件是否已在客户端挂载
 */
export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
