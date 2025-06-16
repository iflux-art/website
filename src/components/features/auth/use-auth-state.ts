
import { useState, useEffect } from 'react';

const LOGIN_TIMEOUT = 24 * 60 * 60 * 1000; // 24小时

/**
 * 用户认证状态管理 Hook
 * 
 * 负责：
 * 1. 检查用户是否已登录
 * 2. 处理登录过期
 * 3. 监听存储变化
 * 
 * @returns 当前的登录状态
 */
export function useAuthState() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn');
      const loginTime = localStorage.getItem('loginTime');

      if (loggedIn === 'true' && loginTime) {
        // 检查登录是否过期
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const isExpired = now - loginTimestamp > LOGIN_TIMEOUT;

        if (!isExpired) {
          setIsLoggedIn(true);
          return;
        }
      }
      setIsLoggedIn(false);
    };

    // 初始检查
    checkAuth();

    // 监听存储变化
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return isLoggedIn;
}
