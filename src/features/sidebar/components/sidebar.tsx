"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronRight, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

// 检查是否在客户端环境
const isBrowser = typeof window !== "undefined";

export interface SidebarItem {
  id: string;
  title: string;
  href?: string;
  children?: SidebarItem[];
  isActive?: boolean;
  isExternal?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface SidebarProps {
  /** 侧边栏项目列表 */
  items: SidebarItem[];
  /** 当前选中的项目ID */
  currentItem?: string;
  /** 项目点击回调 */
  onItemClick?: (itemId: string) => void;
  /** 自定义类名 */
  className?: string;
  /** 本地存储键前缀 */
  storageKey?: string;
  /** 是否显示全部选项 */
  showAllOption?: boolean;
  /** 全部选项的标题 */
  allOptionTitle?: string;
}

/**
 * 基础侧边栏组件
 *
 * 提供通用的侧边栏功能，包括折叠/展开、状态持久化等
 */
export function Sidebar({
  items,
  currentItem,
  onItemClick,
  className,
  storageKey = "sidebar-open-categories",
  showAllOption = false,
  allOptionTitle = "全部",
}: SidebarProps) {
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // 处理鼠标悬停
  const handleHover = (itemId: string | null) => {
    setIsHovering(itemId);
  };

  // 处理项目点击
  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId);
  };

  // 处理折叠状态切换
  const handleOpenChange = useCallback(
    (itemId: string, open: boolean) => {
      setOpenCategories((prev) => {
        const newState = { ...prev, [itemId]: open };
        // 保存到 localStorage（仅在客户端）
        if (isBrowser) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(newState));
          } catch (error) {
            console.warn(
              "Failed to save sidebar state to localStorage:",
              error,
            );
          }
        }
        return newState;
      });
    },
    [storageKey],
  );

  // 初始化折叠状态
  useEffect(() => {
    if (isInitialized.current) return;

    if (isBrowser) {
      const savedStateStr = localStorage.getItem(storageKey);
      if (savedStateStr) {
        try {
          const savedState = JSON.parse(savedStateStr);
          setOpenCategories(savedState);
          isInitialized.current = true;
          return;
        } catch {
          // Failed to parse saved sidebar state
        }
      }
    }

    // 如果没有保存的状态，初始化新状态 - 默认展开所有有子项的分类
    const initialState: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        initialState[item.id] = true;
      }
    });

    setOpenCategories(initialState);
    isInitialized.current = true;
  }, [items, storageKey]);

  // 渲染侧边栏项目
  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const isOpen = openCategories[item.id];
    const hasChildren = item.children && item.children.length > 0;
    const isCurrentItem = currentItem === item.id;

    return (
      <div key={item.id} className={level === 0 ? "mb-4" : "my-1"}>
        {hasChildren ? (
          <Collapsible
            open={isOpen}
            onOpenChange={(open: boolean) => handleOpenChange(item.id, open)}
            className="group w-full space-y-1"
          >
            <CollapsibleTrigger
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
                "transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isCurrentItem && "bg-accent text-accent-foreground",
              )}
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-2">
                {item.icon || (
                  <Folder className="h-4 w-4 text-muted-foreground" />
                )}
                <span>{item.title}</span>
              </div>
              <ChevronRight
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-90",
                )}
                aria-hidden="true"
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in overflow-hidden transition-all">
              <div className="mt-1 ml-2 border-l border-border py-1 pl-4">
                <div className="space-y-1">
                  {item.children?.map((child) =>
                    renderSidebarItem(child, level + 1),
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <button
            onClick={() => handleItemClick(item.id)}
            onMouseEnter={() => handleHover(item.id)}
            onMouseLeave={() => handleHover(null)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              isCurrentItem
                ? "bg-accent font-medium text-accent-foreground"
                : "hover:bg-accent/50",
              isHovering === item.id && "text-foreground",
            )}
            title={item.description}
            aria-current={isCurrentItem ? "page" : undefined}
          >
            {level > 0 ? (
              <div className="flex h-4 w-4 items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              </div>
            ) : (
              item.icon || <Folder className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{item.title}</span>
            {item.isExternal && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      ref={sidebarRef}
      className={cn("hide-scrollbar", className)}
      style={{ direction: "ltr", textAlign: "left" }}
    >
      <div className="space-y-2">
        {/* 全部选项 */}
        {showAllOption && (
          <div className="mb-2">
            <button
              onClick={() => handleItemClick("")}
              onMouseEnter={() => handleHover("all")}
              onMouseLeave={() => handleHover(null)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                !currentItem
                  ? "bg-accent font-medium text-accent-foreground"
                  : "hover:bg-accent/50",
                isHovering === "all" && "text-foreground",
              )}
              aria-current={!currentItem ? "page" : undefined}
            >
              <Folder className="h-4 w-4 text-muted-foreground" />
              <span>{allOptionTitle}</span>
            </button>
          </div>
        )}

        {/* 侧边栏项目列表 */}
        <div className="space-y-1">
          {items.map((item) => renderSidebarItem(item))}
        </div>
      </div>
    </div>
  );
}
