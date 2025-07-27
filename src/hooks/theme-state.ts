/**
 * 主题状态管理 Hook
 */

"use client";

import { useState, useCallback, useEffect } from "react";

interface ThemeState {
  theme: "light" | "dark" | "system";
}

const STORAGE_KEYS = {
  THEME: "iflux-theme",
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

export function useSafeTheme() {
  const [state, setState] = useState<ThemeState>(() => {
    return getStorageItem<ThemeState>(STORAGE_KEYS.THEME, { theme: "system" });
  });

  const setTheme = useCallback((theme: "light" | "dark" | "system") => {
    const newState = { theme };
    setState(newState);
    setStorageItem(STORAGE_KEYS.THEME, newState);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    if (state.theme !== "system" || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      // 这里可以触发主题切换逻辑
      // 通常由 next-themes 处理
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [state.theme]);

  return {
    ...state,
    setTheme,
  };
}
