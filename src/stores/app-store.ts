import { create } from "zustand";

// 全局应用状态类型
export interface GlobalUIState {
  // UI 状态
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  isMobile: boolean;

  // 应用配置
  theme: "light" | "dark" | "system";
  language: string;

  // 通知状态
  notifications: {
    hasUnread: boolean;
    count: number;
  };

  // 加载状态
  isLoading: boolean;
  loadingMessage: string;

  // 错误状态
  error: string | null;
}

export interface AppState extends GlobalUIState {
  // UI Actions
  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  toggleSidebar: () => void;
  toggleSearch: () => void;

  // 配置 Actions
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLanguage: (language: string) => void;

  // 通知 Actions
  setNotifications: (notifications: { hasUnread: boolean; count: number }) => void;
  showNotificationBadge: () => void;
  hideNotificationBadge: () => void;
  incrementNotificationCount: () => void;

  // 加载 Actions
  setLoading: (isLoading: boolean, message?: string) => void;
  showError: (error: string) => void;
  clearError: () => void;

  // 重置 Actions
  resetAppState: () => void;
  resetUIState: () => void;
}

export const useAppStore = create<AppState>(set => ({
  // 初始状态
  isSidebarOpen: false,
  isSearchOpen: false,
  isMobile: false,
  theme: "system",
  language: "zh-CN",
  notifications: {
    hasUnread: false,
    count: 0,
  },
  isLoading: false,
  loadingMessage: "",
  error: null,

  // UI Actions
  setIsSidebarOpen: isOpen => set({ isSidebarOpen: isOpen }),
  setIsSearchOpen: isOpen => set({ isSearchOpen: isOpen }),
  setIsMobile: isMobile => set({ isMobile }),
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleSearch: () => set(state => ({ isSearchOpen: !state.isSearchOpen })),

  // 配置 Actions
  setTheme: theme => set({ theme }),
  setLanguage: language => set({ language }),

  // 通知 Actions
  setNotifications: notifications => set({ notifications }),
  showNotificationBadge: () =>
    set(state => ({
      notifications: {
        ...state.notifications,
        hasUnread: true,
        count: state.notifications.count + 1,
      },
    })),
  hideNotificationBadge: () =>
    set({
      notifications: {
        hasUnread: false,
        count: 0,
      },
    }),
  incrementNotificationCount: () =>
    set(state => ({
      notifications: {
        ...state.notifications,
        count: state.notifications.count + 1,
        hasUnread: true,
      },
    })),

  // 加载 Actions
  setLoading: (isLoading, message = "") => set({ isLoading, loadingMessage: message }),
  showError: error => set({ error, isLoading: false }),
  clearError: () => set({ error: null }),

  // 重置 Actions
  resetAppState: () =>
    set({
      isSidebarOpen: false,
      isSearchOpen: false,
      isMobile: false,
      theme: "system",
      language: "zh-CN",
      notifications: {
        hasUnread: false,
        count: 0,
      },
      isLoading: false,
      loadingMessage: "",
      error: null,
    }),
  resetUIState: () =>
    set({
      isSidebarOpen: false,
      isSearchOpen: false,
      error: null,
    }),
}));
