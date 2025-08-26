/**
 * 搜索功能 React Hook
 */

import { getSearchSuggestions, performSearch } from "@/features/search/lib/search-engine";
import type { SearchOptions, SearchResult } from "@/features/search/types";
import { useCallback, useEffect, useState } from "react";

interface UseSearchReturn {
  search: (query: string, options?: SearchOptions) => Promise<void>;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  query: string;
  suggestions: string[];
  getSuggestions: (query: string) => Promise<void>;
}

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const search = useCallback(
    async (searchQuery: string, options?: SearchOptions): Promise<void> => {
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
    []
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
  };
}
