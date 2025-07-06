import { usePathname } from "next/navigation";

/**
 * 活动路径检查配置项
 */
interface ActiveSectionOptions {
  /** 是否精确匹配 */
  exact?: boolean;
  /** 是否忽略查询参数 */
  ignoreQuery?: boolean;
}

/**
 * Hook for checking if a path section is currently active
 *
 * @returns A function that checks if a given path is active
 * @example
 * ```ts
 * const isActive = useActiveSection();
 *
 * // 基础用法
 * isActive('blog')  // 检查是否以 /blog 开头
 *
 * // 精确匹配
 * isActive('blog', { exact: true })  // 仅匹配 /blog
 *
 * // 忽略查询参数
 * isActive('blog', { ignoreQuery: true })  // /blog?page=1 也会匹配
 * ```
 */
export function useActiveSection() {
  const pathname = usePathname();

  return (key: string, options: ActiveSectionOptions = {}) => {
    const { exact = false, ignoreQuery = true } = options;

    // 构建要比较的路径
    const targetPath = `/${key}`;
    const currentPath = ignoreQuery ? pathname.split("?")[0] : pathname;

    // 精确匹配模式
    if (exact) {
      return currentPath === targetPath;
    }

    // 前缀匹配模式
    return currentPath.startsWith(targetPath);
  };
}
