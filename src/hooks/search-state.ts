/**
 * 搜索状态管理 Hook
 */

"use client";

import { useState, useCallback } from "react";
import type { SearchResult } from "@/types/navigation-types";

interface SearchState {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  history: string[];
  selectedIndex: number;
}

const STORAGE_KEYS = {
  SEARCH_HISTORY: "iflux-search-history",
} as const;

const STATE_CONFIG = {
  MAX_SEARCH_HISTORY: 10,
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

export function useSafeSearch() {
  const [state, setState] = useState<SearchState>({
    isOpen: false,
    query: "",
    results: [],
    isLoading: false,
    history: getStorageItem<string[]>(STORAGE_KEYS.SEARCH_HISTORY, []),
    selectedIndex: 0,
  });

  const openSearch = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const closeSearch = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, query: "", results: [] }));
  }, []);

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const setResults = useCallback((results: SearchResult[]) => {
    setState((prev) => ({ ...prev, results }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setSelectedIndex = useCallback((selectedIndex: number) => {
    setState((prev) => ({ ...prev, selectedIndex }));
  }, []);

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    setState((prev) => {
      const newHistory = [
        query,
        ...prev.history.filter((item) => item !== query),
      ].slice(0, STATE_CONFIG.MAX_SEARCH_HISTORY);

      setStorageItem(STORAGE_KEYS.SEARCH_HISTORY, newHistory);
      return { ...prev, history: newHistory };
    });
  }, []);

  const clearHistory = useCallback(() => {
    setState((prev) => {
      setStorageItem(STORAGE_KEYS.SEARCH_HISTORY, []);
      return { ...prev, history: [] };
    });
  }, []);

  return {
    ...state,
    openSearch,
    closeSearch,
    setQuery,
    setResults,
    setLoading,
    setSelectedIndex,
    addToHistory,
    clearHistory,
  };
}
