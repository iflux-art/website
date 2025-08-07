"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, Folder } from "lucide-react";
import { cn } from "@/utils";
import * as Collapsible from "@radix-ui/react-collapsible";
import { LinksCategory } from "@/types/links-types";

// 检查是否在客户端环境
const isBrowser = typeof window !== "undefined";

export interface LinksSidebarProps {
  categories: LinksCategory[];
  selectedCategory?: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

/**
 * 链接侧边栏组件
 *
 * 显示分类导航，支持分类筛选功能
 * 复用文档侧边栏的样式和交互模式
 */
export function LinksSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
}: LinksSidebarProps) {
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(),
  );

  // 用于存储折叠状态的本地存储键
  const localStorageKey = "links-sidebar-collapsed-categories";

  // 处理鼠标悬停
  const handleHover = (categoryId: string | null) => {
    setIsHovering(categoryId);
  };

  // 处理分类点击
  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);
  };

  // 处理折叠状态切换
  const handleCollapseToggle = useCallback(
    (categoryId: string) => {
      setCollapsedCategories((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(categoryId)) {
          newSet.delete(categoryId);
        } else {
          newSet.add(categoryId);
        }

        // 保存到 localStorage（仅在客户端）
        if (isBrowser) {
          localStorage.setItem(
            localStorageKey,
            JSON.stringify(Array.from(newSet)),
          );
        }

        return newSet;
      });
    },
    [localStorageKey],
  );

  // 初始化折叠状态
  useEffect(() => {
    if (isBrowser) {
      const savedStateStr = localStorage.getItem(localStorageKey);
      if (savedStateStr) {
        try {
          const savedState = JSON.parse(savedStateStr);
          if (Array.isArray(savedState)) {
            setCollapsedCategories(new Set(savedState));
          }
        } catch {
          // Failed to parse saved sidebar state
        }
      }
    }
  }, [localStorageKey]);

  // 过滤掉友链和个人主页分类
  const filteredCategories = categories.filter(
    (cat) => cat.id !== "friends" && cat.id !== "profile",
  );

  // 按 order 排序分类
  const sortedCategories = filteredCategories.sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });

  // 分离可折叠和不可折叠的分类
  const collapsibleCategories = sortedCategories.filter(
    (cat) => cat.collapsible,
  );
  const nonCollapsibleCategories = sortedCategories.filter(
    (cat) => !cat.collapsible,
  );

  return (
    <div
      className={cn("hide-scrollbar", className)}
      style={{ direction: "ltr", textAlign: "left" }}
    >
      <div className="space-y-1">
        {/* 全部分类选项 */}
        <button
          onClick={() => handleCategoryClick("")}
          onMouseEnter={() => handleHover("all")}
          onMouseLeave={() => handleHover(null)}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
            !selectedCategory
              ? "bg-accent font-medium text-accent-foreground"
              : "hover:bg-accent/50",
            isHovering === "all" && "text-foreground",
          )}
        >
          <Folder className="h-4 w-4 text-muted-foreground" />
          <span>全部分类</span>
        </button>

        {/* 可折叠分类 */}
        {collapsibleCategories.map((category) => {
          const isCollapsed = collapsedCategories.has(category.id);
          return (
            <div key={category.id} className="space-y-1">
              <Collapsible.Root
                open={!isCollapsed}
                onOpenChange={() => handleCollapseToggle(category.id)}
              >
                <Collapsible.Trigger
                  className="group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50"
                  onClick={() => handleCategoryClick(category.id)}
                  onMouseEnter={() => handleHover(category.id)}
                  onMouseLeave={() => handleHover(null)}
                  title={category.description}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span
                      className={cn(
                        "text-foreground",
                        selectedCategory === category.id &&
                          "font-semibold text-accent-foreground",
                      )}
                    >
                      {category.name}
                    </span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      !isCollapsed && "rotate-90",
                    )}
                  />
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <div className="mt-1 ml-6 space-y-1">
                    {category.children?.map((subCategory) => (
                      <button
                        key={subCategory.id}
                        onClick={() => handleCategoryClick(subCategory.id)}
                        onMouseEnter={() => handleHover(subCategory.id)}
                        onMouseLeave={() => handleHover(null)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          selectedCategory === subCategory.id
                            ? "bg-accent font-medium text-accent-foreground"
                            : "hover:bg-accent/50",
                          isHovering === subCategory.id && "text-foreground",
                        )}
                        title={subCategory.description}
                      >
                        <div className="flex h-4 w-4 items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                        </div>
                        <span>{subCategory.name}</span>
                      </button>
                    ))}
                  </div>
                </Collapsible.Content>
              </Collapsible.Root>
            </div>
          );
        })}

        {/* 不可折叠分类 - 直接显示为顶级目录 */}
        {nonCollapsibleCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            onMouseEnter={() => handleHover(category.id)}
            onMouseLeave={() => handleHover(null)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              selectedCategory === category.id
                ? "bg-accent font-medium text-accent-foreground"
                : "hover:bg-accent/50",
              isHovering === category.id && "text-foreground",
            )}
            title={category.description}
          >
            <Folder className="h-4 w-4 text-muted-foreground" />
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
