"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/utils";
import { ChevronRight, Folder } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { SidebarItem, SidebarProps } from "@/features/navigation/types";

// 检查是否在客户端环境
const isBrowser = typeof window !== "undefined";

// 侧边栏状态管理hook
function useSidebarState(items: SidebarItem[], storageKey: string) {
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const isInitialized = useRef(false);

  // 处理鼠标悬停
  const handleHover = (itemId: string | null) => {
    setIsHovering(itemId);
  };

  // 处理折叠状态切换
  const handleOpenChange = useCallback(
    (itemId: string, open: boolean) => {
      setOpenCategories(prev => {
        const newState = { ...prev, [itemId]: open };
        // 保存到 localStorage（仅在客户端）
        if (isBrowser) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(newState));
          } catch (error) {
            console.warn("Failed to save sidebar state to localStorage:", error);
          }
        }
        return newState;
      });
    },
    [storageKey]
  );

  // 初始化折叠状态
  useEffect(() => {
    if (isInitialized.current) return;

    if (isBrowser) {
      const savedStateStr = localStorage.getItem(storageKey);
      if (savedStateStr) {
        try {
          const savedState: Record<string, boolean> = JSON.parse(savedStateStr) as Record<
            string,
            boolean
          >;
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
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        initialState[item.id] = true;
      }
    });

    setOpenCategories(initialState);
    isInitialized.current = true;
  }, [items, storageKey]);

  return {
    isHovering,
    openCategories,
    handleHover,
    handleOpenChange,
  };
}

// 外部链接图标组件
const ExternalIcon = () => (
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
    role="img"
    aria-label="外部链接"
  >
    <title>外部链接</title>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// 项目图标组件
interface ItemIconProps {
  item: SidebarItem;
  level: number;
}

const ItemIcon = ({ item, level }: ItemIconProps) => {
  if (level > 0) {
    return (
      <div className="flex h-4 w-4 items-center justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
      </div>
    );
  }
  return item.icon ?? <Folder className="h-4 w-4 text-muted-foreground" />;
};

// 折叠项目组件
interface CollapsibleItemProps {
  item: SidebarItem;
  isOpen: boolean;
  isCurrentItem: boolean;
  level: number;
  onOpenChange: (itemId: string, open: boolean) => void;
  renderSidebarItem: (item: SidebarItem, level?: number) => React.ReactNode;
}

const CollapsibleItem = ({
  item,
  isOpen,
  isCurrentItem,
  level,
  onOpenChange,
  renderSidebarItem,
}: CollapsibleItemProps) => (
  <Collapsible
    open={isOpen}
    onOpenChange={(open: boolean) => onOpenChange(item.id, open)}
    className="group w-full space-y-1"
  >
    <CollapsibleTrigger
      className={cn(
        "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
        "transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isCurrentItem && "bg-accent text-accent-foreground"
      )}
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-2">
        {item.icon ?? <Folder className="h-4 w-4 text-muted-foreground" />}
        <span>{item.title}</span>
      </div>
      <ChevronRight
        className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen && "rotate-90")}
        aria-hidden="true"
      />
    </CollapsibleTrigger>
    <CollapsibleContent className="data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in overflow-hidden transition-all">
      <div className="mt-1 ml-2 border-l border-border py-1 pl-4">
        <div className="space-y-1">
          {item.children?.map(child => renderSidebarItem(child, level + 1))}
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
);

// 按钮项目组件
interface ButtonItemProps {
  item: SidebarItem;
  isCurrentItem: boolean;
  level: number;
  isHovering: boolean;
  onItemClick: (itemId: string) => void;
  onHover: (itemId: string | null) => void;
}

const ButtonItem = ({
  item,
  isCurrentItem,
  level,
  isHovering,
  onItemClick,
  onHover,
}: ButtonItemProps) => (
  <button
    type="button"
    onClick={() => onItemClick(item.id)}
    onMouseEnter={() => onHover(item.id)}
    onMouseLeave={() => onHover(null)}
    className={cn(
      "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
      isCurrentItem ? "bg-accent font-medium text-accent-foreground" : "hover:bg-accent/50",
      isHovering && "text-foreground"
    )}
    title={item.description}
    aria-current={isCurrentItem ? "page" : undefined}
  >
    <ItemIcon item={item} level={level} />
    <span>{item.title}</span>
    {item.isExternal && <ExternalIcon />}
  </button>
);

/**
 * 基础侧边栏组件
 *
 * 提供通用的侧边栏功能，包括折叠/展开、状态持久化等
 */
export const Sidebar = ({
  items,
  currentItem,
  onItemClick,
  className,
  storageKey = "sidebar-open-categories",
  showAllOption = false,
  allOptionTitle = "全部",
}: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isHovering, openCategories, handleHover, handleOpenChange } = useSidebarState(
    items,
    storageKey
  );

  // 处理项目点击
  const handleItemClick = useCallback(
    (itemId: string) => {
      onItemClick?.(itemId);
    },
    [onItemClick]
  );

  // 渲染侧边栏项目
  const renderSidebarItem = useCallback(
    (item: SidebarItem, level = 0) => {
      // 修复：添加空值检查并提供默认值
      const isOpen = openCategories[item.id] ?? false;
      const hasChildren = item.children && item.children.length > 0;
      const isCurrentItem = currentItem === item.id;

      return (
        <div key={item.id} className={level === 0 ? "mb-4" : "my-1"}>
          {hasChildren ? (
            <CollapsibleItem
              item={item}
              isOpen={isOpen}
              isCurrentItem={isCurrentItem}
              level={level}
              onOpenChange={handleOpenChange}
              renderSidebarItem={renderSidebarItem}
            />
          ) : (
            <ButtonItem
              item={item}
              isCurrentItem={isCurrentItem}
              level={level}
              isHovering={isHovering === item.id}
              onItemClick={handleItemClick}
              onHover={handleHover}
            />
          )}
        </div>
      );
    },
    [openCategories, currentItem, handleOpenChange, isHovering, handleItemClick, handleHover]
  );

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
              type="button"
              onClick={() => handleItemClick("")}
              onMouseEnter={() => handleHover("all")}
              onMouseLeave={() => handleHover(null)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                !currentItem
                  ? "bg-accent font-medium text-accent-foreground"
                  : "hover:bg-accent/50",
                isHovering === "all" && "text-foreground"
              )}
              aria-current={!currentItem ? "page" : undefined}
            >
              <Folder className="h-4 w-4 text-muted-foreground" />
              <span>{allOptionTitle}</span>
            </button>
          </div>
        )}

        {/* 侧边栏项目列表 */}
        <div className="space-y-1">{items.map(item => renderSidebarItem(item))}</div>
      </div>
    </div>
  );
};
