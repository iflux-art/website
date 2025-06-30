import React from 'react';
import type { SearchResult } from '@/hooks/use-safe-state';
import { ArrowRight, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/utils';
import { TYPE_LABELS } from '@/components/features/search/commands';

interface SearchResultsProps {
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

export function SearchResults({
  results,
  searchQuery,
  isLoading,
  selectedIndex,
  setSelectedIndex,
  onSelect,
  onClearHistory,
  searchHistory,
  onHistoryClick,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (results.length > 0) {
    return (
      <div className="py-2">
        {results.map((result, index) => (
          <div
            key={index}
            onClick={() => onSelect(result)}
            className={cn(
              'flex items-start gap-2 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer',
              selectedIndex === index && 'bg-accent'
            )}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="flex-shrink-0 mt-1 text-muted-foreground">
              {result.type === 'tool' && '🔧'}
              {result.type === 'blog' && '📝'}
              {result.type === 'docs' && '📖'}
              {result.type === 'link' && '🔗'}
              {result.type === 'command' && '⚡'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium mb-1 truncate flex items-center gap-1">
                {result.title}
                {result.type === 'link' && <ExternalLink className="h-3 w-3" />}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{result.description}</p>
              <div className="text-xs text-muted-foreground mt-1 capitalize">
                {TYPE_LABELS[result.type as keyof typeof TYPE_LABELS] || result.type}
              </div>
            </div>
            {result.type === 'command' && result.description === '最近搜索' ? (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onHistoryClick(result.title);
                }}
                className="shrink-0 hover:text-primary"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-1" />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (searchQuery.trim()) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">没有找到与 "{searchQuery}" 相关的结果</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <p className="text-muted-foreground">输入关键词搜索或使用命令</p>
      {searchHistory.length > 0 && (
        <button onClick={onClearHistory} className="mt-2 text-xs text-primary hover:underline">
          清除搜索历史
        </button>
      )}
    </div>
  );
}
