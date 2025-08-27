import { create } from "zustand";
import type { UserResource } from "@clerk/types";

// 用户偏好设置类型
export interface UserPreferences {
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
}

interface AuthState {
  // 用户数据 (来自 Clerk)
  user: UserResource | null;
  isLoaded: boolean;
  isSignedIn: boolean;

  // 用户偏好设置
  preferences: UserPreferences;

  // 应用状态
  isAdminMode: boolean;
  lastActiveAt: number | null;

  // Actions
  setUser: (user: UserResource | null, isLoaded: boolean, isSignedIn: boolean) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLanguage: (language: string) => void;
  setAdminMode: (isAdminMode: boolean) => void;
  updateLastActive: () => void;
  resetAuthState: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  // 初始状态
  user: null,
  isLoaded: false,
  isSignedIn: false,
  preferences: {
    theme: "system",
    language: "zh-CN",
    notifications: {
      email: true,
      push: true,
    },
    privacy: {
      profileVisible: true,
      showEmail: true,
    },
  },
  isAdminMode: false,
  lastActiveAt: null,

  // Actions
  setUser: (user, isLoaded, isSignedIn) =>
    set({
      user,
      isLoaded,
      isSignedIn,
      // 当用户登录时更新最后活跃时间
      lastActiveAt: isSignedIn ? Date.now() : null,
    }),
  setPreferences: preferences =>
    set(state => ({
      preferences: {
        ...state.preferences,
        ...preferences,
      },
    })),
  setTheme: theme =>
    set(state => ({
      preferences: {
        ...state.preferences,
        theme,
      },
    })),
  setLanguage: language =>
    set(state => ({
      preferences: {
        ...state.preferences,
        language,
      },
    })),
  setAdminMode: isAdminMode => set({ isAdminMode }),
  updateLastActive: () => set({ lastActiveAt: Date.now() }),
  resetAuthState: () =>
    set({
      user: null,
      isLoaded: false,
      isSignedIn: false,
      preferences: {
        theme: "system",
        language: "zh-CN",
        notifications: {
          email: true,
          push: true,
        },
        privacy: {
          profileVisible: true,
          showEmail: true,
        },
      },
      isAdminMode: false,
      lastActiveAt: null,
    }),
}));
