"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, Book, Home, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Button } from "@/components/ui/button";
import { HighlightText } from "@/components/ui/highlight-text";
import { SEARCH_ITEMS, SEARCH_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

// 搜索按钮组件
export function CleanSearchButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="搜索"
      onClick={onClick}
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

// 搜索对话框组件
export function CleanSearchDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // 防抖处理
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  // 执行搜索
  const performSearch = React.useCallback(async (searchValue: string) => {
    if (!searchValue.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // 构建API URL
      const params = new URLSearchParams();
      params.append('q', searchValue);
      params.append('t', Date.now().toString()); // 避免缓存
      const url = `/api/search?${params.toString()}`;

      // 调用搜索API
      console.log('调用搜索API:', url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`搜索失败: ${response.status}`);
      }

      const data = await response.json();
      console.log('API搜索结果:', data.results);

      if (data.results && Array.isArray(data.results)) {
        // 合并API结果和预定义项目
        const searchTerm = searchValue.toLowerCase().trim();
        const filteredItems = SEARCH_ITEMS.filter(item => {
          const titleMatch = item.title.toLowerCase().includes(searchTerm);
          const titleEnMatch = item.titleEn?.toLowerCase().includes(searchTerm);
          return titleMatch || titleEnMatch;
        }).map(item => ({
          id: `predefined-${item.id}`,
          title: item.title,
          description: item.titleEn,
          url: item.url,
          category: item.category,
        }));

        // 合并结果并去重
        const allResults = [...filteredItems, ...data.results];
        const uniqueResults = allResults.filter((item, index, self) =>
          index === self.findIndex(t => t.url === item.url)
        );

        console.log('合并后的搜索结果:', uniqueResults);
        setResults(uniqueResults);
      } else {
        // 如果API返回错误或无结果，仅使用预定义项目
        const searchTerm = searchValue.toLowerCase().trim();
        const filteredItems = SEARCH_ITEMS.filter(item => {
          const titleMatch = item.title.toLowerCase().includes(searchTerm);
          const titleEnMatch = item.titleEn?.toLowerCase().includes(searchTerm);
          return titleMatch || titleEnMatch;
        }).map(item => ({
          id: `predefined-${item.id}`,
          title: item.title,
          description: item.titleEn,
          url: item.url,
          category: item.category,
        }));

        console.log('预定义搜索结果:', filteredItems);
        setResults(filteredItems);
      }
    } catch (error) {
      console.error('搜索出错:', error);
      // 出错时仅使用预定义项目
      const searchTerm = searchValue.toLowerCase().trim();
      const filteredItems = SEARCH_ITEMS.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const titleEnMatch = item.titleEn?.toLowerCase().includes(searchTerm);
        return titleMatch || titleEnMatch;
      }).map(item => ({
        id: `predefined-${item.id}`,
        title: item.title,
        description: item.titleEn,
        url: item.url,
        category: item.category,
      }));

      setResults(filteredItems);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 处理搜索输入变化
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      // 清除之前的定时器
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // 设置新的定时器，延迟300ms执行搜索
      debounceTimeout.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    },
    [performSearch]
  );

  // 组件卸载时清除定时器
  React.useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // 处理搜索项点击
  const handleItemClick = React.useCallback((url: string) => {
    router.push(url);
    setOpen(false);
  }, [router]);

  // 获取分类图标
  const getCategoryIcon = React.useCallback((category: string) => {
    switch (category) {
      case "pages":
        return <Home className="h-4 w-4" />;
      case "docs":
        return <FileText className="h-4 w-4" />;
      case "blog":
        return <Book className="h-4 w-4" />;
      case "navigation":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  }, []);

  // 按分类组织搜索结果
  const groupedResults = React.useMemo(() => {
    const grouped: Record<string, typeof SEARCH_ITEMS> = {};

    // 初始化分类
    SEARCH_CATEGORIES.forEach(category => {
      grouped[category.id] = [];
    });

    // 按分类分组
    results.forEach(item => {
      if (grouped[item.category]) {
        grouped[item.category].push(item);
      }
    });

    return grouped;
  }, [results]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <CleanSearchButton onClick={() => setOpen(true)} />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] sm:max-w-[600px] translate-x-[-50%] translate-y-[-50%] p-0 overflow-hidden duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
          )}
        >
          {/* 使用VisuallyHidden包装DialogTitle，使其对屏幕阅读器可访问但视觉上不可见 */}
          <DialogPrimitive.Title asChild>
            <VisuallyHidden>搜索对话框</VisuallyHidden>
          </DialogPrimitive.Title>

          <div className="rounded-lg border shadow-md bg-background overflow-hidden">
            {/* 搜索输入框 */}
            <div className="flex items-center px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-9 w-full bg-transparent py-2 text-sm outline-none border-none placeholder:text-muted-foreground"
                placeholder="搜索内容..."
                value={query}
                onChange={handleInputChange}
                autoFocus
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">清除</span>
                </Button>
              )}
            </div>

            {/* 分隔线 - 只在有搜索结果或正在加载时显示 */}
            {(isLoading || (query && results.length > 0)) && (
              <div className="h-px bg-border mx-3"></div>
            )}

            {/* 搜索结果列表 */}
            <div className={`max-h-[300px] overflow-y-auto ${(isLoading || (query && results.length > 0)) ? 'p-2' : 'p-0'}`}>
              {isLoading && (
                <div className="py-6 text-center text-sm">
                  <div className="animate-pulse">搜索中...</div>
                </div>
              )}

              {!isLoading && (
                <>
                  {/* 显示搜索结果 */}
                  {Object.entries(groupedResults).map(([categoryId, items]) => {
                    if (items.length === 0) return null;

                    const category = SEARCH_CATEGORIES.find(c => c.id === categoryId);

                    return (
                      <div key={categoryId} className="mb-4">
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          {category?.labelKey || categoryId}
                        </div>
                        <div>
                          {items.map(item => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                              onClick={() => handleItemClick(item.url)}
                              role="button"
                              tabIndex={0}
                              aria-label={`转到${item.title}`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  handleItemClick(item.url);
                                }
                              }}
                            >
                              <div className="flex flex-col w-full">
                                <div className="flex items-center">
                                  <span className="mr-2 text-muted-foreground">
                                    {getCategoryIcon(item.category)}
                                  </span>
                                  <span className="font-medium">
                                    <HighlightText text={item.title} query={query} />
                                  </span>
                                </div>
                                {item.description && (
                                  <div className="ml-6 text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                    <HighlightText text={item.description} query={query} />
                                  </div>
                                )}
                                {item.content && (
                                  <div className="ml-6 text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                    <HighlightText text={item.content} query={query} />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* 如果没有任何结果，显示提示信息 */}
                  {query && !isLoading && Object.values(groupedResults).every(group => group.length === 0) && (
                    <div className="py-6 text-center text-sm">
                      未找到与 "<span className="font-medium text-primary">{query}</span>" 相关的内容
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
