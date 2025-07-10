import { useSafeAuth } from "@/hooks/state";

/**
 * 用户认证状态管理 Hook
 *
 * 使用安全状态管理，提供：
 * 1. 检查用户是否已登录
 * 2. 处理登录过期
 * 3. 自动状态同步
 *
 * @returns 当前的登录状态
 */
export function useAuthState() {
  const { isLoggedIn } = useSafeAuth();
  return isLoggedIn;
}
