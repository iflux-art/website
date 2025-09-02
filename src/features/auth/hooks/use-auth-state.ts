"use client";

import type { UserResource } from "@clerk/types";
import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/stores";

export interface UseAuthStateReturn {
  // 用户数据 (来自 Zustand)
  user: UserResource | null;
  isLoaded: boolean;
  isSignedIn: boolean;

  // 用户偏好设置
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
    privacy: {
      profileVisible: boolean;
      showEmail: boolean;
    };
  };

  // 应用状态
  isAdminMode: boolean;
  lastActiveAt: number | null;

  // Actions (来自 Zustand)
  setUser: (user: UserResource | null, isLoaded: boolean, isSignedIn: boolean) => void;
  setPreferences: (
    preferences: Partial<{
      theme: "light" | "dark" | "system";
      language: string;
      notifications: { email: boolean; push: boolean };
      privacy: { profileVisible: boolean; showEmail: boolean };
    }>
  ) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLanguage: (language: string) => void;
  setAdminMode: (isAdminMode: boolean) => void;
  updateLastActive: () => void;
  resetState: () => void;

  // 自定义方法
  initializeAuth: (user: UserResource | null, isLoaded: boolean, isSignedIn: boolean) => void;
  updatePreferences: (
    preferences: Partial<{
      theme: "light" | "dark" | "system";
      language: string;
      notifications: { email: boolean; push: boolean };
      privacy: { profileVisible: boolean; showEmail: boolean };
    }>
  ) => void;
  toggleAdminMode: () => void;
}

/**
 * Auth状态管理Hook (使用 Zustand)
 * 封装了用户认证模块的所有状态管理和数据处理逻辑
 */
export function useAuthState(): UseAuthStateReturn {
  // 从 Zustand store 获取状态和 actions
  const {
    user,
    isLoaded,
    isSignedIn,
    preferences,
    isAdminMode,
    lastActiveAt,
    setUser,
    setPreferences,
    setTheme,
    setLanguage,
    setAdminMode,
    updateLastActive,
    resetState,
  } = useAuthStore();

  // 初始化认证状态
  const initializeAuth = useCallback(
    (user: UserResource | null, isLoaded: boolean, isSignedIn: boolean) => {
      setUser(user, isLoaded, isSignedIn);
    },
    [setUser]
  );

  // 更新用户偏好设置
  const updatePreferences = useCallback(
    (newPreferences: Partial<typeof preferences>) => {
      setPreferences(newPreferences);
    },
    [setPreferences]
  );

  // 切换管理员模式
  const toggleAdminMode = useCallback(() => {
    setAdminMode(!isAdminMode);
  }, [isAdminMode, setAdminMode]);

  // 当用户处于登录状态时，定期更新最后活跃时间
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isSignedIn) {
      // 每分钟更新一次最后活跃时间
      intervalId = setInterval(() => {
        updateLastActive();
      }, 60000);
    }

    // 清理函数
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSignedIn, updateLastActive]);

  return {
    // 用户数据
    user,
    isLoaded,
    isSignedIn,

    // 用户偏好设置
    preferences,

    // 应用状态
    isAdminMode,
    lastActiveAt,

    // Actions
    setUser,
    setPreferences,
    setTheme,
    setLanguage,
    setAdminMode,
    updateLastActive,
    resetState,

    // 自定义方法
    initializeAuth,
    updatePreferences,
    toggleAdminMode,
  };
}
