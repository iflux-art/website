import { ReactNode } from 'react';

export interface SearchDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  type: 'doc' | 'blog' | 'navigation' | 'tool' | 'command' | 'history';
  icon: ReactNode;
  isExternal?: boolean;
  action?: () => void;
}

export interface Command {
  id: string;
  title: string;
  description: string;
  action: () => void;
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
