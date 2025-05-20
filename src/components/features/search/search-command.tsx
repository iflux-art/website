"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, FileText, Home, Book, Link as LinkIcon, History, X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command/command-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useSearch } from "@/hooks/use-search";
import { SearchButtonProps, SearchDialogProps, SearchResult } from "@/types/search";
import { SEARCH_CATEGORIES, SEARCH_ITEMS } from "@/lib/constants";

/**
 * 搜索图标按钮组件
 * 样式与语言切换和主题切换按钮保持一致
 *
 * @example
 * <SearchButton onClick={() => setOpen(true)} />
 */
export function SearchButton({ onClick, className }: SearchButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="搜索"
      onClick={onClick}
      className={className}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key="search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <Search className="h-[1.1rem] w-[1.1rem]" />
          <span className="sr-only">搜索</span>
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}

/**
 * 搜索命令对话框组件
 * 使用Command组件实现的搜索对话框
 *
 * @example
 * <SearchCommandDialog />
 */
export function SearchCommandDialog({ className, open: externalOpen, onOpenChange: externalOnOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [showHistory, setShowHistory] = React.useState(false);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const { isLoading, search, getSearchHistory, clearSearchHistory } = useSearch();

  // 清除搜索结果
  const clearResults = React.useCallback(() => {
    setResults([]);
  }, []);

  // 同步外部和内部的open状态
  React.useEffect(() => {
    if (externalOpen !== undefined) {
      setOpen(externalOpen);
    }
  }, [externalOpen]);

  // 处理open状态变化
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (externalOnOpenChange) {
      externalOnOpenChange(newOpen);
    }
    if (!newOpen) {
      // 关闭对话框时重置状态
      setTimeout(() => {
        setQuery("");
        clearResults();
        setShowHistory(false);
      }, 200);
    }
  }, [externalOnOpenChange, clearResults]);

  // 键盘快捷键打开搜索框
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        handleOpenChange(!open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleOpenChange]);

  // 处理搜索项点击
  const handleItemSelect = React.useCallback((url: string) => {
    router.push(url);
    handleOpenChange(false);
  }, [router, handleOpenChange]);

  // 处理搜索输入变化
  const handleInputChange = React.useCallback((value: string) => {
    setQuery(value);
    if (value.trim()) {
      // 添加调试日志
      console.log('搜索查询:', value);
      // 直接使用预定义的搜索项进行过滤
      const searchTerm = value.toLowerCase().trim();
      const filteredItems = SEARCH_ITEMS
        .filter(item => {
          const titleMatch = item.title.toLowerCase().includes(searchTerm);
          const titleEnMatch = item.titleEn?.toLowerCase().includes(searchTerm);
          return titleMatch || titleEnMatch;
        })
        .map(item => ({
          id: `predefined-${item.id}`,
          title: item.title,
          description: item.titleEn,
          url: item.url,
          category: item.category,
        }));

      console.log('过滤结果:', filteredItems);
      setResults(filteredItems);
      setShowHistory(false);
    } else {
      clearResults();
      setShowHistory(true);
    }
  }, [clearResults]);

  // 处理历史记录点击
  const handleHistorySelect = React.useCallback((historyQuery: string) => {
    setQuery(historyQuery);
    // 直接使用预定义的搜索项进行过滤
    const searchTerm = historyQuery.toLowerCase().trim();
    const filteredItems = SEARCH_ITEMS
      .filter(item => {
        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const titleEnMatch = item.titleEn?.toLowerCase().includes(searchTerm);
        return titleMatch || titleEnMatch;
      })
      .map(item => ({
        id: `predefined-${item.id}`,
        title: item.title,
        description: item.titleEn,
        url: item.url,
        category: item.category,
      }));

    console.log('历史记录搜索结果:', filteredItems);
    setResults(filteredItems);
    setShowHistory(false);
  }, []);

  // 获取分类图标
  const getCategoryIcon = React.useCallback((category: string) => {
    switch (category) {
      case "pages":
        return <Home className="mr-2 h-4 w-4" />;
      case "docs":
        return <FileText className="mr-2 h-4 w-4" />;
      case "blog":
        return <Book className="mr-2 h-4 w-4" />;
      case "navigation":
        return <LinkIcon className="mr-2 h-4 w-4" />;
      default:
        return <Search className="mr-2 h-4 w-4" />;
    }
  }, []);

  // 获取分类标签
  const getCategoryLabel = React.useCallback((category: string) => {
    const categoryConfig = SEARCH_CATEGORIES.find(c => c.id === category);
    return categoryConfig ? categoryConfig.labelKey : category;
  }, []);

  // 格式化日期
  const formatDate = React.useCallback((dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "";
    }
  }, []);

  // 获取搜索历史
  const searchHistory = React.useMemo(() => {
    return getSearchHistory();
  }, [getSearchHistory, open, showHistory]);

  // 清除所有历史记录
  const handleClearHistory = React.useCallback(() => {
    console.log('清除历史记录');

    // 直接清除localStorage中的历史记录
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('searchHistory');
        console.log('历史记录已清除');
      }
    } catch (error) {
      console.error('清除历史记录失败:', error);
    }

    // 强制更新搜索历史
    setQuery('');
    setShowHistory(false);

    // 强制重新渲染
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => {
        setOpen(true);
      }, 100);
    }, 100);
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <SearchButton onClick={() => handleOpenChange(true)} className={className} />
      </DialogTrigger>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput
          placeholder="搜索内容..."
          value={query}
          onValueChange={handleInputChange}
        />
        <CommandList>
          {isLoading ? (
            <div className="py-6 text-center text-sm">
              <div className="animate-pulse">搜索中...</div>
            </div>
          ) : (
            <>
              {showHistory && searchHistory.length > 0 && (
                <CommandGroup heading="搜索历史">
                  {searchHistory.map((item, index) => (
                    <CommandItem
                      key={`history-${index}`}
                      onSelect={() => handleHistorySelect(item.query)}
                    >
                      <History className="mr-2 h-4 w-4" />
                      <span>{item.query}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {formatDate(new Date(item.timestamp).toISOString())}
                      </span>
                    </CommandItem>
                  ))}
                  <CommandItem onSelect={handleClearHistory} className="text-muted-foreground">
                    <X className="mr-2 h-4 w-4" />
                    <span>清除历史记录</span>
                  </CommandItem>
                </CommandGroup>
              )}

              {query && results.length === 0 && !isLoading && (
                <CommandEmpty>未找到相关内容</CommandEmpty>
              )}

              {results && results.length > 0 && (
                <>
                  {/* 按分类分组显示结果 */}
                  {SEARCH_CATEGORIES.map(category => {
                    // 添加调试日志
                    console.log('处理分类:', category.id, '结果:', results);

                    const categoryResults = results.filter(
                      result => result.category === category.id
                    );

                    console.log('分类结果:', category.id, categoryResults);

                    if (categoryResults.length === 0) return null;

                    return (
                      <CommandGroup key={category.id} heading={category.labelKey}>
                        {categoryResults.map(result => (
                          <CommandItem
                            key={result.id}
                            onSelect={() => handleItemSelect(result.url)}
                          >
                            {getCategoryIcon(result.category)}
                            <div className="flex flex-col">
                              <span>{result.title}</span>
                              {result.description && (
                                <span className="text-xs text-muted-foreground line-clamp-1">
                                  {result.description}
                                </span>
                              )}
                            </div>
                            {result.date && (
                              <span className="ml-auto flex items-center text-xs text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDate(result.date)}
                              </span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    );
                  })}
                </>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </Dialog>
  );
}
