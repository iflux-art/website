'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Wrench, ExternalLink, Clock, Command } from 'lucide-react';
import { SearchDialogProps, SearchResult } from './types';
import { COMMANDS, SEARCH_HISTORY_KEY } from './commands';
import { TOOLS, NAVIGATION_SITES } from './data';
import { SearchBar } from './search-bar';
import { SearchResults } from './search-results';
import { KeyboardHints } from './keyboard-hints';

/**
 * 搜索对话框组件
 * 提供全站内容搜索、命令执行和历史记录功能
 */
export function SearchDialog({ open, onOpenChangeAction }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = (query: string) => {
    if (!query.trim()) return;
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  // 清除搜索历史
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };


  // 处理结果选择
  const handleSelect = (result: SearchResult) => {
    if (result.action) {
      result.action();
    } else if (result.isExternal) {
      window.open(result.path, '_blank');
    } else {
      router.push(result.path);
      if (result.type !== 'history' && result.type !== 'command') {
        saveToHistory(searchQuery);
      }
    }
    onOpenChangeAction(false);
  };

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  // 搜索逻辑
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      // 显示搜索历史和快捷命令
      const historyResults: SearchResult[] = searchHistory
        .filter(item => item.toLowerCase().includes(query))
        .map(item => ({
          title: item,
          path: '#',
          excerpt: '最近搜索',
          type: 'history' as const,
          icon: <Clock className="h-4 w-4" />,
          action: () => setSearchQuery(item)
        }));

      const commandResults: SearchResult[] = COMMANDS.map(cmd => ({
        title: cmd.title,
        path: '',
        excerpt: cmd.description,
        type: 'command',
        icon: <Command className="h-4 w-4" />,
        action: cmd.action,
      }));

      setResults([...commandResults, ...historyResults]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      // 处理历史记录
      const historyResults: SearchResult[] = searchHistory
        .filter(item => item.toLowerCase().includes(query))
        .map(item => ({
          title: item,
          path: '#',
          excerpt: '最近搜索',
          type: 'history' as const,
          icon: <Clock className="h-4 w-4" />,
          action: () => setSearchQuery(item)
        }));

      // 处理工具结果
      const toolResults: SearchResult[] = TOOLS.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      ).map(tool => ({
        title: tool.name,
        path: tool.path,
        excerpt: tool.description,
        type: 'tool' as const,
        icon: <Wrench className="h-4 w-4" />
      }));

      // 处理导航结果
      const navigationResults: SearchResult[] = NAVIGATION_SITES.filter(site =>
        site.name.toLowerCase().includes(query) ||
        site.description.toLowerCase().includes(query) ||
        site.category.toLowerCase().includes(query)
      ).map(site => ({
        title: site.name,
        path: site.url,
        excerpt: site.description,
        type: 'navigation' as const,
        icon: <ExternalLink className="h-4 w-4" />,
        isExternal: true
      }));

      // 处理命令结果
      const commandResults: SearchResult[] = COMMANDS.filter(command =>
        command.title.toLowerCase().includes(query) ||
        command.description.toLowerCase().includes(query)
      ).map(command => ({
        title: command.title,
        path: '#',
        excerpt: command.description,
        type: 'command' as const,
        icon: <Command className="h-4 w-4" />,
        action: command.action
      }));

      const allResults: SearchResult[] = [
        ...historyResults,
        ...toolResults,
        ...navigationResults,
        ...commandResults
      ];
      setResults(allResults);
      setIsLoading(false);
      setSelectedIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchHistory]);

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden border dark:border-gray-700 shadow-lg [&>button]:hidden">
        <DialogTitle className="sr-only">站内搜索</DialogTitle>

        <SearchBar
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
          onClear={() => setSearchQuery('')}
          placeholder="搜索文档、工具、导航..."
        />

        <div className="flex-1 overflow-hidden">
          <div className="h-[50vh] overflow-y-auto">
            <SearchResults
              results={results}
              searchQuery={searchQuery}
              isLoading={isLoading}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              onSelect={handleSelect}
              onClearHistory={clearHistory}
              searchHistory={searchHistory}
              onHistoryClick={query => setSearchQuery(query)}
            />
          </div>
        </div>

        <KeyboardHints />
      </DialogContent>
    </Dialog>
  );
}

// 导出所有子组件
export * from './types';
export * from './commands';
export * from './search-bar';
export * from './search-results';
export * from './keyboard-hints';
export * from './data';