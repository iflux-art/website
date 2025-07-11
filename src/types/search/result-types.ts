import { ReactNode } from "react";
import { BaseSearchResult } from "@/types/data-types";

export interface SearchDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export interface SearchResult extends BaseSearchResult {
  type: "doc" | "blog" | "navigation" | "tool" | "command" | "history" | "link";
  icon: ReactNode;
  isExternal?: boolean;
  action?: () => void;
  url?: string;
}

export interface SearchDialogContentProps {
  results: SearchResult[];
  searchQuery: string;
  isLoading: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onSelect: (result: SearchResult) => void;
  onClearHistory: () => void;
  searchHistory: string[];
}

export interface SearchHistoryProps {
  searchHistory: string[];
  onClear: () => void;
}

export interface APISearchResult extends BaseSearchResult {
  type: "doc" | "blog" | "tool" | "link";
}

export interface SearchRequest {
  q: string;
  type?: "doc" | "blog" | "tool" | "link";
  limit?: number;
}

export interface SearchResponse {
  success: boolean;
  results: APISearchResult[];
  count: number;
  error?: string;
}

export interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
  onClear?: () => void;
}

export interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  isLoading: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onSelect: (result: SearchResult) => void;
  onClearHistory: () => void;
  searchHistory: string[];
  onHistoryClick: (query: string) => void;
}
