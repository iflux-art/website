/**
 * 过滤状态管理 Hook
 */

"use client";

import { useState, useCallback } from "react";

interface FilterState {
  selectedCategory: string;
  selectedTag: string | null;
  searchTerm: string;
}

export function useSafeFilter() {
  const [state, setState] = useState<FilterState>({
    selectedCategory: "",
    selectedTag: null,
    searchTerm: "",
  });

  const setSelectedCategory = useCallback((category: string) => {
    setState((prev) => ({ ...prev, selectedCategory: category }));
  }, []);

  const setSelectedTag = useCallback((tag: string | null) => {
    setState((prev) => ({ ...prev, selectedTag: tag }));
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    setState((prev) => ({ ...prev, searchTerm: term }));
  }, []);

  const clearFilters = useCallback(() => {
    setState({
      selectedCategory: "",
      selectedTag: null,
      searchTerm: "",
    });
  }, []);

  const resetCategory = useCallback(() => {
    setState((prev) => ({ ...prev, selectedCategory: "" }));
  }, []);

  const resetTag = useCallback(() => {
    setState((prev) => ({ ...prev, selectedTag: null }));
  }, []);

  const resetSearch = useCallback(() => {
    setState((prev) => ({ ...prev, searchTerm: "" }));
  }, []);

  return {
    ...state,
    setSelectedCategory,
    setSelectedTag,
    setSearchTerm,
    clearFilters,
    resetCategory,
    resetTag,
    resetSearch,
  };
}
