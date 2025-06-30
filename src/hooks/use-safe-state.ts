/**
 * 安全的状态管理 Hook
 * 完全避免 SSR 问题的状态管理解决方案
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// ==================== 类型定义 ====================

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'tool' | 'link' | 'docs' | 'blog' | 'command' | 'navigation' | 'doc' | 'history';
  icon?: string;
  category?: string;
  tags?: string[];
}

interface NavbarState {
  direction: 'up' | 'down';
  position: number;
  showTitle: boolean;
  pageTitle: string;
  lastDirectionChange: number;
}

interface SearchState {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  history: string[];
  selectedIndex: number;
}

interface AuthState {
  isLoggedIn: boolean;
  loginTime: number | null;
}

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
}

interface FilterState {
  selectedCategory: string;
  selectedTag: string | null;
  searchTerm: string;
}

interface ToolHistoryItem {
  id: string;
  timestamp: number;
  input: string;
  output: string;
  tool: string;
}

interface ToolState {
  input: string;
  output: string;
  loading: boolean;
  error: string | null;
  history: ToolHistoryItem[];
}

// ==================== 常量 ====================

const STORAGE_KEYS = {
  THEME: 'iflux-theme',
  AUTH: 'iflux-auth',
  SEARCH_HISTORY: 'iflux-search-history',
  TOOL_HISTORY: 'iflux-tool-history',
} as const;

const STATE_CONFIG = {
  LOGIN_TIMEOUT: 24 * 60 * 60 * 1000, // 24小时
  MAX_SEARCH_HISTORY: 10,
  MAX_TOOL_HISTORY: 20,
  SCROLL_THRESHOLD: 3,
  SHOW_THRESHOLD: 80,
  HIDE_THRESHOLD: 120,
} as const;

// ==================== 工具函数 ====================

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 忽略存储错误
  }
}

// ==================== 导航栏状态 ====================

export function useSafeNavbar() {
  const [state, setState] = useState<NavbarState>({
    direction: 'up',
    position: 0,
    showTitle: false,
    pageTitle: '',
    lastDirectionChange: 0,
  });

  const setScrollPosition = useCallback((position: number) => {
    setState(prev => {
      const now = Date.now();
      const newDirection = position > prev.position ? 'down' : 'up';
      const directionChanged = newDirection !== prev.direction;

      // 首页始终显示导航菜单
      if (prev.pageTitle === '首页') {
        return {
          ...prev,
          direction: newDirection,
          position,
          showTitle: false,
          lastDirectionChange: directionChanged ? now : prev.lastDirectionChange,
        };
      }

      // 忽略微小的滚动变化
      if (Math.abs(position - prev.position) <= STATE_CONFIG.SCROLL_THRESHOLD) {
        return prev;
      }

      const newState: NavbarState = {
        ...prev,
        direction: newDirection,
        position,
        lastDirectionChange: directionChanged ? now : prev.lastDirectionChange,
      };

      // 根据滚动方向和位置决定是否显示标题
      if (newDirection === 'down' && position > STATE_CONFIG.HIDE_THRESHOLD) {
        newState.showTitle = true;
      } else if (newDirection === 'up' && position < STATE_CONFIG.SHOW_THRESHOLD) {
        newState.showTitle = false;
      }

      return newState;
    });
  }, []);

  const setPageTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, pageTitle: title }));
  }, []);

  const scrollToTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return {
    ...state,
    setScrollPosition,
    setPageTitle,
    scrollToTop,
  };
}

// ==================== 搜索状态 ====================

export function useSafeSearch() {
  const [state, setState] = useState<SearchState>({
    isOpen: false,
    query: '',
    results: [],
    isLoading: false,
    history: [],
    selectedIndex: 0,
  });

  // 加载搜索历史
  useEffect(() => {
    const history = getStorageItem(STORAGE_KEYS.SEARCH_HISTORY, []);
    setState(prev => ({ ...prev, history }));
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setState(prev => ({
      ...prev,
      isOpen: open,
      ...(open ? {} : { query: '', results: [], selectedIndex: 0 }),
    }));
  }, []);

  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query, selectedIndex: 0 }));
  }, []);

  const setResults = useCallback((results: SearchResult[]) => {
    setState(prev => ({ ...prev, results, selectedIndex: 0 }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setSelectedIndex = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      selectedIndex: Math.max(0, Math.min(index, prev.results.length - 1)),
    }));
  }, []);

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    setState(prev => {
      const newHistory = [query, ...prev.history.filter(item => item !== query)].slice(
        0,
        STATE_CONFIG.MAX_SEARCH_HISTORY
      );
      setStorageItem(STORAGE_KEYS.SEARCH_HISTORY, newHistory);
      return { ...prev, history: newHistory };
    });
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
    setStorageItem(STORAGE_KEYS.SEARCH_HISTORY, []);
  }, []);

  const resetSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      results: [],
      isLoading: false,
      selectedIndex: 0,
    }));
  }, []);

  return {
    ...state,
    setOpen,
    setQuery,
    setResults,
    setLoading,
    setSelectedIndex,
    addToHistory,
    clearHistory,
    resetSearch,
  };
}

// ==================== 认证状态 ====================

export function useSafeAuth() {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    loginTime: null,
  });

  // 加载认证状态
  useEffect(() => {
    const authData = getStorageItem(STORAGE_KEYS.AUTH, { isLoggedIn: false, loginTime: null });
    setState(authData);
  }, []);

  const setLoginState = useCallback((isLoggedIn: boolean, loginTime?: number) => {
    const newState = {
      isLoggedIn,
      loginTime: loginTime || Date.now(),
    };
    setState(newState);
    setStorageItem(STORAGE_KEYS.AUTH, newState);
  }, []);

  const logout = useCallback(() => {
    const newState = { isLoggedIn: false, loginTime: null };
    setState(newState);
    setStorageItem(STORAGE_KEYS.AUTH, newState);
  }, []);

  const checkLoginExpiry = useCallback(() => {
    if (!state.isLoggedIn || !state.loginTime) return false;

    const isExpired = Date.now() - state.loginTime > STATE_CONFIG.LOGIN_TIMEOUT;
    if (isExpired) {
      logout();
      return false;
    }
    return true;
  }, [state.isLoggedIn, state.loginTime, logout]);

  return {
    ...state,
    setLoginState,
    logout,
    checkLoginExpiry,
  };
}

// ==================== 主题状态 ====================

export function useSafeTheme() {
  const [theme, setThemeState] = useState<ThemeState['theme']>('system');

  // 加载主题设置
  useEffect(() => {
    const savedTheme = getStorageItem(STORAGE_KEYS.THEME, 'system');
    setThemeState(savedTheme);
  }, []);

  const setTheme = useCallback((newTheme: ThemeState['theme']) => {
    setThemeState(newTheme);
    setStorageItem(STORAGE_KEYS.THEME, newTheme);
  }, []);

  return {
    theme,
    setTheme,
  };
}

// ==================== 过滤状态 ====================

export function useSafeFilter() {
  const [state, setState] = useState<FilterState>({
    selectedCategory: '',
    selectedTag: null,
    searchTerm: '',
  });

  const setCategory = useCallback((category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  const setTag = useCallback((tag: string | null) => {
    setState(prev => ({ ...prev, selectedTag: tag }));
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const reset = useCallback(() => {
    setState({
      selectedCategory: '',
      selectedTag: null,
      searchTerm: '',
    });
  }, []);

  return {
    ...state,
    setCategory,
    setTag,
    setSearchTerm,
    reset,
  };
}

// ==================== 工具状态 ====================

export function useSafeTool() {
  const [state, setState] = useState<ToolState>({
    input: '',
    output: '',
    loading: false,
    error: null,
    history: [],
  });

  // 加载工具历史
  useEffect(() => {
    const history = getStorageItem(STORAGE_KEYS.TOOL_HISTORY, []);
    setState(prev => ({ ...prev, history }));
  }, []);

  const setInput = useCallback((input: string) => {
    setState(prev => ({ ...prev, input, error: null }));
  }, []);

  const setOutput = useCallback((output: string) => {
    setState(prev => ({ ...prev, output }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, output: error ? '' : prev.output }));
  }, []);

  const addToHistory = useCallback((item: ToolHistoryItem) => {
    setState(prev => {
      const exists = prev.history.some(
        h => h.input === item.input && h.output === item.output && h.tool === item.tool
      );

      if (!exists) {
        const newHistory = [item, ...prev.history].slice(0, STATE_CONFIG.MAX_TOOL_HISTORY);
        setStorageItem(STORAGE_KEYS.TOOL_HISTORY, newHistory);
        return { ...prev, history: newHistory };
      }
      return prev;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
    setStorageItem(STORAGE_KEYS.TOOL_HISTORY, []);
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      input: '',
      output: '',
      loading: false,
      error: null,
    }));
  }, []);

  return {
    ...state,
    setInput,
    setOutput,
    setLoading,
    setError,
    addToHistory,
    clearHistory,
    reset,
  };
}
