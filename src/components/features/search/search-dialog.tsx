"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// Icons are now handled in SearchResults component
import { SearchDialogProps, APISearchResult } from "@/types";
import type { SearchResult } from "@/types/search-types";
import { COMMANDS } from "@/components/features/search/commands";
import { TOOLS } from "@/components/features/search/search-data";
import items from "@/data/links/items.json";
import type { LinksItem as Item } from "@/types/links-types";
import { SearchBar } from "@/components/features/search/search-bar";
import { SearchResults } from "@/components/features/search/search-results";
import { KeyboardHints } from "@/components/features/search/keyboard-hints";
import { useSafeSearch } from "@/hooks/state";

/**
 * 搜索对话框组件
 * 提供全站内容搜索、命令执行和历史记录功能
 */
export function SearchDialog({ open, onOpenChangeAction }: SearchDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 使用安全状态管理
  const {
    query: searchQuery,
    results,
    isLoading,
    selectedIndex,
    history: searchHistory,
    setQuery: setSearchQuery,
    setResults,
    setLoading: setIsLoading,
    setSelectedIndex,
    addToHistory: saveToHistory,
    clearHistory,
    // resetSearch 功能暂时不需要
  } = useSafeSearch();

  // 处理结果选择
  const handleSelect = (result: SearchResult) => {
    if (result.type === "link") {
      window.open(result.url, "_blank");
    } else if (result.url && result.url !== "#") {
      router.push(result.url);
      if (result.type !== "command") {
        saveToHistory(searchQuery);
      }
    } else if (result.type === "command") {
      // 处理命令类型的结果
      if (result.title.includes("切换主题")) {
        document.documentElement.classList.toggle("dark");
      } else if (result.title.includes("查看文档")) {
        router.push("/docs");
      }
    }
    onOpenChangeAction(false);
  };

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        selectedIndex > 0 ? selectedIndex - 1 : results.length - 1,
      );
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(
        selectedIndex < results.length - 1 ? selectedIndex + 1 : 0,
      );
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  // 搜索逻辑
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      // 显示搜索历史和快捷命令
      const historyResults: SearchResult[] = searchHistory
        .filter((item: string) => item.toLowerCase().includes(query))
        .map((item: string, index: number) => ({
          id: `history-${index}`,
          title: item,
          url: "#",
          path: "#",
          description: "最近搜索",
          excerpt: "最近搜索",
          type: "command" as const,
          icon: null,
        }));

      const commandResults: SearchResult[] = COMMANDS.map((cmd, index) => ({
        id: `command-${index}`,
        title: cmd.title,
        url: "",
        path: "",
        description: cmd.description,
        excerpt: cmd.description,
        type: "command" as const,
        icon: null,
      }));

      setResults([...commandResults, ...historyResults]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      // 处理文档搜索结果
      const docResults: SearchResult[] = [];
      const blogResults: SearchResult[] = [];
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
        );
        const data = await response.json();

        // 处理文档搜索结果
        docResults.push(
          ...data.results
            .filter((result: APISearchResult) => result.type === "doc")
            .map((doc: APISearchResult, index: number) => ({
              id: `doc-${index}`,
              title: doc.title,
              url: doc.path,
              path: doc.path,
              description: doc.excerpt,
              excerpt: doc.excerpt,
              type: "docs" as const,
              icon: null,
            })),
        );

        // 处理博客搜索结果
        blogResults.push(
          ...data.results
            .filter((result: APISearchResult) => result.type === "blog")
            .map((blog: APISearchResult, index: number) => ({
              id: `blog-${index}`,
              title: blog.title,
              url: blog.path,
              path: blog.path,
              description: blog.excerpt,
              excerpt: blog.excerpt,
              type: "blog" as const,
              icon: null,
            })),
        );
      } catch (error) {
        console.error("Error fetching search results:", error);
      }

      // 处理历史记录
      const historyResults: SearchResult[] = searchHistory
        .filter((item: string) => item.toLowerCase().includes(query))
        .map((item: string, index: number) => ({
          id: `history-search-${index}`,
          title: item,
          url: "#",
          path: "#",
          description: "最近搜索",
          excerpt: "最近搜索",
          type: "command" as const,
          icon: null,
        }));

      // 处理工具结果
      const toolResults: SearchResult[] = TOOLS.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query)),
      ).map((tool, index) => ({
        id: `tool-${index}`,
        title: tool.name,
        url: tool.path,
        path: tool.path,
        description: tool.description,
        excerpt: tool.description,
        type: "tool" as const,
        icon: null,
      }));

      // 处理命令结果
      const commandResults: SearchResult[] = COMMANDS.filter(
        (command) =>
          command.title.toLowerCase().includes(query) ||
          command.description.toLowerCase().includes(query),
      ).map((command, index) => ({
        id: `command-search-${index}`,
        title: command.title,
        url: "#",
        path: "#",
        description: command.description,
        excerpt: command.description,
        type: "command" as const,
        icon: null,
      }));

      // 处理链接导航搜索结果
      const linkResults: SearchResult[] = (items as Item[])
        .filter(
          (item: Item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.tags.some((tag: string) => tag.toLowerCase().includes(query)),
        )
        .map((item: Item, index: number) => ({
          id: `link-${index}`,
          title: item.title,
          url: item.url,
          path: item.url,
          description: item.description,
          excerpt: item.description,
          type: "link" as const,
          icon: null,
        }));

      const allResults: SearchResult[] = [
        ...historyResults,
        ...docResults,
        ...blogResults,
        ...toolResults,
        ...linkResults,
        ...commandResults,
      ];
      setResults(allResults);
      setIsLoading(false);
      setSelectedIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchHistory]);

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="gap-0 overflow-hidden border p-0 shadow-lg sm:max-h-[85vh] sm:max-w-[550px] dark:border-gray-700 [&>button]:hidden">
        <DialogTitle className="sr-only">站内搜索</DialogTitle>

        <SearchBar
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
          onClear={() => setSearchQuery("")}
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
              onHistoryClick={(query) => setSearchQuery(query)}
            />
          </div>
        </div>

        <KeyboardHints />
      </DialogContent>
    </Dialog>
  );
}

// 导出所有子组件
export * from "../../../types/search-types";
export * from "@/components/features/search/commands";
export * from "@/components/features/search/search-bar";
export * from "@/components/features/search/search-results";
export * from "@/components/features/search/keyboard-hints";
export * from "@/components/features/search/search-data";
