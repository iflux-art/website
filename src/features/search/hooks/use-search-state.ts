/**
 * 搜索状态管理 React Hook
 * 集成 Zustand 状态管理
 */

import { getSearchSuggestions, performSearch } from "@/features/search/lib/search-engine";
import type { SearchOptions, SearchResult } from "@/features/search/types";
import { useCallback, useEffect, useState } from "react";
import { useSearchStore } from "@/stores";

interface UseSearchStateReturn {
  search: (query: string, options?: SearchOptions) => Promise<void>;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  query: string;
  suggestions: string[];
  getSuggestions: (query: string) => Promise<void>;
  // Zustand 状态
  searchTerm: string;
  selectedCategory: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  resetSearch: () => void;
}

export function useSearchState(): UseSearchStateReturn {
  // 使用 Zustand 管理搜索状态
  const { searchTerm, selectedCategory, setSearchTerm, setSelectedCategory, resetState } =
    useSearchStore();

  // 本地状态管理搜索结果和加载状态
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // 当 Zustand 中的搜索词改变时，更新本地查询状态
  useEffect(() => {
    setQuery(searchTerm);
  }, [searchTerm]);

  const search = useCallback(
    async (searchQuery: string, options?: SearchOptions): Promise<void> => {
      // 更新 Zustand 状态
      setSearchTerm(searchQuery);

      setIsLoading(true);
      setError(null);
      setQuery(searchQuery);

      try {
        const response = await performSearch(searchQuery, options);
        setResults(response.results);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Search failed";
        setError(errorMessage);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [setSearchTerm]
  );

  const getSuggestions = useCallback(async (searchQuery: string): Promise<void> => {
    try {
      const suggestionList = await getSearchSuggestions(searchQuery);
      setSuggestions(suggestionList);
    } catch (err) {
      console.error("Failed to get suggestions:", err);
      setSuggestions([]);
    }
  }, []);

  // 清理建议当查询为空时
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
    }
  }, [query]);

  return {
    search,
    results,
    isLoading,
    error,
    query,
    suggestions,
    getSuggestions,
    // Zustand 状态和动作
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    resetSearch: resetState,
  };
}
