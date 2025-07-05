import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 用户类型定义
export type User = {
  id: string;
  name: string;
  email: string;
};

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  setUser: (user: User) => void;
  toggleTheme: () => void;
  clearStore: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      user: null,
      theme: 'light',
      setUser: user => set({ user }),
      toggleTheme: () =>
        set(state => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      clearStore: () => set({ user: null, theme: 'light' }),
    }),
    {
      name: 'app-storage',
      partialize: state => ({ theme: state.theme }),
    }
  )
);
