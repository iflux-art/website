'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, FileText, Link, Search } from 'lucide-react';
import { useSearch } from '@/features/search/hooks/use-search';
import type { SearchResult } from '@/features/search/types';

// 搜索结果项组件
interface SearchResultItemProps {
  result: SearchResult;
  index: number;
  onResultClick: (result: SearchResult) => void;
}

const SearchResultItem = ({ result, index, onResultClick }: SearchResultItemProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'link':
        return <Link className="h-4 w-4" />;
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'doc':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <div
      key={result.title || index}
      className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent"
      onClick={() => onResultClick(result)}
      onKeyDown={e => e.key === 'Enter' && onResultClick(result)}
      tabIndex={0}
      role="button"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 text-muted-foreground">{getIcon(result.type)}</div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h4 className="truncate text-sm font-medium">{result.title}</h4>
            <Badge variant="secondary" className="text-xs">
              {result.type}
            </Badge>
          </div>
          {result.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{result.description}</p>
          )}
          {result.tags && result.tags.length > 0 && (
            <div className="mt-2 flex gap-1">
              {result.tags.slice(0, 3).map((tag, _tagIndex) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 搜索结果列表组件
interface SearchResultsProps {
  isLoading: boolean;
  results: SearchResult[];
  query: string;
  onResultClick: (result: SearchResult) => void;
}

const SearchResults = ({ isLoading, results, query, onResultClick }: SearchResultsProps) => {
  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">搜索中...</div>;
  }

  if (results.length > 0) {
    return (
      <div className="space-y-2">
        {results.map((result, index) => (
          <SearchResultItem
            key={result.title || index}
            result={result}
            index={index}
            onResultClick={onResultClick}
          />
        ))}
      </div>
    );
  }

  if (query.trim()) {
    return <div className="py-8 text-center text-muted-foreground">未找到相关结果</div>;
  }

  return null;
};

// 搜索输入组件
interface SearchInputProps {
  query: string;
  onChange: (value: string) => void;
}

const SearchInput = ({ query, onChange }: SearchInputProps) => (
  <div className="relative mb-4">
    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
    <Input
      placeholder="搜索链接、文章、文档..."
      value={query}
      onChange={e => onChange(e.target.value)}
      className="pl-10"
    />
  </div>
);

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState('');
  const { search, results, isLoading } = useSearch();

  // 监听键盘快捷键 (Ctrl+K 或 Command+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const searchTimeout = setTimeout(() => {
      void search(query);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, search]);

  const handleResultClick = (result: SearchResult) => {
    if (result.url) {
      window.open(result.url, '_blank');
    } else if (result.path) {
      window.location.href = result.path;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>搜索</DialogTitle>
        </DialogHeader>

        <SearchInput query={query} onChange={setQuery} />

        <div className="flex-1 overflow-y-auto">
          <SearchResults
            isLoading={isLoading}
            results={results}
            query={query}
            onResultClick={handleResultClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
