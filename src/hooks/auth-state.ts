/**
 * 认证状态管理 Hook
 */

"use client";

import { useState, useCallback, useEffect } from "react";

interface AuthState {
  isLoggedIn: boolean;
  loginTime: number | null;
}

const STORAGE_KEYS = {
  AUTH: "iflux-auth",
} as const;

const STATE_CONFIG = {
  LOGIN_TIMEOUT: 24 * 60 * 60 * 1000, // 24小时
} as const;

// 工具函数
function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 忽略存储错误
  }
}

/**
 * 用户认证状态管理 Hook (简化版)
 *
 * @returns 当前的登录状态
 */
export function useAuthState() {
  const { isLoggedIn } = useSafeAuth();
  return isLoggedIn;
}

export function useSafeAuth() {
  const [state, setState] = useState<AuthState>(() => {
    const stored = getStorageItem<AuthState>(STORAGE_KEYS.AUTH, {
      isLoggedIn: false,
      loginTime: null,
    });

    // 检查登录是否过期
    if (stored.isLoggedIn && stored.loginTime) {
      const now = Date.now();
      const isExpired = now - stored.loginTime > STATE_CONFIG.LOGIN_TIMEOUT;
      if (isExpired) {
        return { isLoggedIn: false, loginTime: null };
      }
    }

    return stored;
  });

  const login = useCallback(() => {
    const now = Date.now();
    const newState = { isLoggedIn: true, loginTime: now };
    setState(newState);
    setStorageItem(STORAGE_KEYS.AUTH, newState);
  }, []);

  const logout = useCallback(() => {
    const newState = { isLoggedIn: false, loginTime: null };
    setState(newState);
    setStorageItem(STORAGE_KEYS.AUTH, newState);
  }, []);

  // 检查登录状态是否过期
  useEffect(() => {
    if (!state.isLoggedIn || !state.loginTime) return;

    const checkExpiration = () => {
      const now = Date.now();
      const isExpired = now - state.loginTime! > STATE_CONFIG.LOGIN_TIMEOUT;
      if (isExpired) {
        logout();
      }
    };

    // 立即检查一次
    checkExpiration();

    // 每分钟检查一次
    const interval = setInterval(checkExpiration, 60 * 1000);
    return () => clearInterval(interval);
  }, [state.isLoggedIn, state.loginTime, logout]);

  return {
    ...state,
    login,
    logout,
  };
}
