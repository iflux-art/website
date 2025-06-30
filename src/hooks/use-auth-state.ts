import { useEffect } from 'react';
import { useSafeAuth } from '@/hooks/use-safe-state';

/**
 * 用户认证状态管理 Hook
 *
 * 使用安全状态管理，提供：
 * 1. 检查用户是否已登录
 * 2. 处理登录过期
 * 3. 自动状态同步
 *
 * @returns 当前的登录状态和相关操作
 */
export function useAuthState() {
  const { isLoggedIn, checkLoginExpiry } = useSafeAuth();

  useEffect(() => {
    // 初始检查登录状态
    checkLoginExpiry();

    // 监听存储变化（跨标签页同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'iflux-auth') {
        checkLoginExpiry();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkLoginExpiry]);

  return isLoggedIn;
}
