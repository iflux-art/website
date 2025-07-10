/**
 * 工具状态管理 Hook
 */

"use client";

import { useState, useCallback } from "react";

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

const STORAGE_KEYS = {
  TOOL_HISTORY: "iflux-tool-history",
} as const;

const STATE_CONFIG = {
  MAX_TOOL_HISTORY: 20,
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

export function useSafeTool() {
  const [state, setState] = useState<ToolState>(() => {
    const history = getStorageItem<ToolHistoryItem[]>(
      STORAGE_KEYS.TOOL_HISTORY,
      [],
    );
    return {
      input: "",
      output: "",
      loading: false,
      error: null,
      history,
    };
  });

  const setInput = useCallback((input: string) => {
    setState((prev) => ({ ...prev, input }));
  }, []);

  const setOutput = useCallback((output: string) => {
    setState((prev) => ({ ...prev, output }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const addToHistory = useCallback(
    (item: Omit<ToolHistoryItem, "id" | "timestamp">) => {
      const historyItem: ToolHistoryItem = {
        ...item,
        id: `${item.tool}-${Date.now()}`,
        timestamp: Date.now(),
      };

      setState((prev) => {
        const newHistory = [historyItem, ...prev.history].slice(
          0,
          STATE_CONFIG.MAX_TOOL_HISTORY,
        );
        setStorageItem(STORAGE_KEYS.TOOL_HISTORY, newHistory);
        return { ...prev, history: newHistory };
      });
    },
    [],
  );

  const clearHistory = useCallback(() => {
    setState((prev) => {
      setStorageItem(STORAGE_KEYS.TOOL_HISTORY, []);
      return { ...prev, history: [] };
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setState((prev) => {
      const newHistory = prev.history.filter((item) => item.id !== id);
      setStorageItem(STORAGE_KEYS.TOOL_HISTORY, newHistory);
      return { ...prev, history: newHistory };
    });
  }, []);

  const clearInput = useCallback(() => {
    setState((prev) => ({ ...prev, input: "" }));
  }, []);

  const clearOutput = useCallback(() => {
    setState((prev) => ({ ...prev, output: "" }));
  }, []);

  const clearAll = useCallback(() => {
    setState((prev) => ({ ...prev, input: "", output: "", error: null }));
  }, []);

  return {
    ...state,
    setInput,
    setOutput,
    setLoading,
    setError,
    addToHistory,
    clearHistory,
    removeFromHistory,
    clearInput,
    clearOutput,
    clearAll,
  };
}
