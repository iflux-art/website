'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, File, FileText, BookOpen, Compass, X, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

// 搜索结果类型
interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  type: 'doc' | 'blog' | 'navigation';
  icon: React.ReactNode;
}

// 搜索对话框属性
interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 搜索对话框组件
 * 提供全站内容搜索功能
 */
export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 模拟搜索结果数据 - 实际项目中应该从API获取
  const mockSearch = (query: string): SearchResult[] => {
    if (!query.trim()) return [];

    // 模拟搜索延迟
    return [
      {
        title: '快速开始指南',
        path: '/docs/getting-started',
        excerpt: `包含了${query}相关的入门指南和基础概念介绍...`,
        type: 'doc',
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        title: '如何使用组件库',
        path: '/docs/components',
        excerpt: `详细介绍了组件库的使用方法，包括${query}的示例代码...`,
        type: 'doc',
        icon: <File className="h-4 w-4" />,
      },
      {
        title: `关于${query}的最新博客`,
        path: '/blog/latest-updates',
        excerpt: `探讨了${query}的最新发展和应用场景...`,
        type: 'blog',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        title: '常用网站导航',
        path: '/navigation',
        excerpt: `收集了与${query}相关的优质网站和工具资源...`,
        type: 'navigation',
        icon: <Compass className="h-4 w-4" />,
      },
    ];
  };

  // 处理搜索
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // 模拟API请求延迟
    setTimeout(() => {
      const searchResults = mockSearch(searchQuery);
      setResults(searchResults);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 500);
  };

  // 当搜索框打开时自动聚焦
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // 当搜索查询变化时执行搜索
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].path);
          onOpenChange(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onOpenChange(false);
        break;
    }
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden border dark:border-gray-700 shadow-lg">
        <DialogTitle className="sr-only">站内搜索</DialogTitle>
        <div className="flex items-center border-b p-4">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索文档、博客和导航..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" onClick={clearSearch} className="h-6 w-6 ml-2">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* 搜索结果区域 */}
        <div className="max-h-[50vh]">
          <div className="max-h-[50vh]">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <Link
                    href={result.path}
                    key={index}
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      'flex items-start gap-2 px-4 py-3 hover:bg-accent/50 transition-colors',
                      selectedIndex === index && 'bg-accent'
                    )}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex-shrink-0 mt-1 text-muted-foreground">{result.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium mb-1 truncate">{result.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{result.excerpt}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-1" />
                  </Link>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">没有找到与 "{searchQuery}" 相关的结果</p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">输入关键词开始搜索</p>
              </div>
            )}
          </div>
        </div>

        {/* 快捷键提示 */}
        <div className="border-t p-2 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>导航:</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↓</kbd>
          </div>
          <div className="flex items-center gap-2">
            <span>选择:</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd>
          </div>
          <div className="flex items-center gap-2">
            <span>关闭:</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
