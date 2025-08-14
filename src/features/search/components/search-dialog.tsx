"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, BookOpen, FileText, Link } from "lucide-react";
import { useSearch } from "../hooks/use-search";
import type { SearchResult } from "../types";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const { search, results, isLoading } = useSearch();

  // 监听键盘快捷键 (Ctrl+K 或 Command+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const searchTimeout = setTimeout(async () => {
      await search(query);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, search]);

  const handleResultClick = (result: SearchResult) => {
    if (result.url) {
      window.open(result.url, "_blank");
    } else if (result.path) {
      window.location.href = result.path;
    }
    onOpenChange(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "link":
        return <Link className="h-4 w-4" />;
      case "blog":
        return <FileText className="h-4 w-4" />;
      case "doc":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>搜索</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="搜索链接、文章、文档..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              搜索中...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-muted-foreground">
                      {getIcon(result.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="truncate text-sm font-medium">
                          {result.title}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {result.type}
                        </Badge>
                      </div>
                      {result.description && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {result.description}
                        </p>
                      )}
                      {result.tags && result.tags.length > 0 && (
                        <div className="mt-2 flex gap-1">
                          {result.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="py-8 text-center text-muted-foreground">
              未找到相关结果
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
