"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { LinksCategory } from "@/features/links/types";
import { cn } from "@/utils";
import { ChevronRight, Folder } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// 检查是否在客户端环境
const isBrowser = typeof window !== "undefined";

export interface LinksSidebarCardProps {
  categories: LinksCategory[];
  selectedCategory?: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
  /**
   * 存储折叠状态的键
   * @default 'links-sidebar-open-categories'
   */
  storageKey?: string;
  /**
   * 是否显示标题栏
   * @default true
   */
  showHeader?: boolean;
}

// 折叠状态管理hook
function useCollapsibleState(categories: LinksCategory[], storageKey: string) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const isInitialized = useRef(false);

  // 处理折叠状态切换
  const handleOpenChange = useCallback(
    (categoryId: string, open: boolean) => {
      setOpenCategories(prev => {
        const newState = { ...prev, [categoryId]: open };
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
          const savedState: Record<string, boolean> = JSON.parse(savedStateStr);
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
    categories.forEach(category => {
      if (category.children && category.children.length > 0) {
        initialState[category.id] = true;
      }
    });

    setOpenCategories(initialState);
    isInitialized.current = true;
  }, [categories, storageKey]);

  return { openCategories, handleOpenChange };
}

// 子分类项组件
interface ChildCategoryItemProps {
  child: LinksCategory;
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const ChildCategoryItem = ({
  child,
  selectedCategory,
  onCategoryClick,
}: ChildCategoryItemProps) => {
  const isChildSelected = selectedCategory === child.id;
  return (
    <button
      type="button"
      key={child.id}
      onClick={() => {
        console.log("点击子分类:", child.id);
        onCategoryClick(child.id);
      }}
      className={cn(
        "flex min-h-[40px] w-full touch-manipulation items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors sm:min-h-[32px] sm:px-3 sm:py-1.5",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isChildSelected
          ? "bg-primary/90 font-medium text-primary-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground active:bg-muted/80"
      )}
    >
      <div className="h-2 w-2 rounded-full bg-current opacity-50" />
      <span className="flex-1">{child.name}</span>
    </button>
  );
};

// 可折叠分类组件
interface CollapsibleCategoryProps {
  category: LinksCategory;
  selectedCategory: string;
  isOpen: boolean;
  onOpenChange: (categoryId: string, open: boolean) => void;
  onCategoryClick: (categoryId: string) => void;
}

const CollapsibleCategory = ({
  category,
  selectedCategory,
  isOpen,
  onOpenChange,
  onCategoryClick,
}: CollapsibleCategoryProps) => {
  const isSelected = selectedCategory === category.id;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open: boolean) => onOpenChange(category.id, open)}
      className="group w-full space-y-1"
    >
      <CollapsibleTrigger
        className={cn(
          "flex min-h-[44px] w-full touch-manipulation items-center justify-between rounded-md px-2.5 py-2.5 text-left text-sm transition-colors sm:min-h-[36px] sm:px-3 sm:py-2",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          isSelected
            ? "bg-primary font-medium text-primary-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground active:bg-muted/80"
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Folder className="h-3.5 w-3.5" />
          <span className="flex-1">{category.name}</span>
        </div>
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            isOpen && "rotate-90"
          )}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in overflow-hidden transition-all">
        <div className="mt-1 ml-4 space-y-1">
          {category.children?.map((child: LinksCategory) => (
            <ChildCategoryItem
              key={child.id}
              child={child}
              selectedCategory={selectedCategory}
              onCategoryClick={onCategoryClick}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// 普通分类组件
interface SimpleCategoryProps {
  category: LinksCategory;
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SimpleCategory = ({ category, selectedCategory, onCategoryClick }: SimpleCategoryProps) => {
  const isSelected = selectedCategory === category.id;

  return (
    <button
      type="button"
      onClick={() => {
        console.log("点击分类:", category.id);
        onCategoryClick(category.id);
      }}
      className={cn(
        "flex min-h-[44px] w-full touch-manipulation items-center gap-2 rounded-md px-2.5 py-2.5 text-left text-sm transition-colors sm:min-h-[36px] sm:px-3 sm:py-2",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isSelected
          ? "bg-primary font-medium text-primary-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground active:bg-muted/80"
      )}
    >
      <Folder className="h-3.5 w-3.5" />
      <span className="flex-1">{category.name}</span>
    </button>
  );
};

/**
 * 链接分类侧边栏卡片组件
 *
 * 以卡片形式显示链接分类导航，支持分类筛选功能
 */
export const LinksSidebarCard = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
  storageKey = "links-sidebar-open-categories",
  showHeader = true,
}: LinksSidebarCardProps) => {
  const { openCategories, handleOpenChange } = useCollapsibleState(categories, storageKey);

  // 处理分类数据
  const processedCategories = useMemo(() => {
    // 过滤掉友链和个人主页分类
    const filteredCategories = categories.filter(
      cat => cat.id !== "friends" && cat.id !== "profile"
    );

    // 按 order 排序分类
    return filteredCategories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [categories]);

  const currentSelectedCategory = selectedCategory || "";

  const handleCategoryClick = (categoryId: string) => {
    console.log("处理分类点击:", categoryId);
    // 如果点击的是当前选中的分类，则取消选择
    if (currentSelectedCategory === categoryId) {
      onCategoryChange("");
    } else {
      onCategoryChange(categoryId);
    }
  };

  const handleShowAll = () => {
    console.log("显示全部分类");
    onCategoryChange("");
  };

  return (
    <Card className={cn("w-full", className)}>
      {showHeader && (
        <CardHeader className="pt-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Folder className="h-3.5 w-3.5 text-primary" />
            分类导航
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showHeader ? "pt-0 pb-4" : "py-4"}>
        <div className="hide-scrollbar max-h-[calc(100vh-12rem)] space-y-1.5 overflow-y-auto sm:max-h-[calc(100vh-12rem)] sm:space-y-2">
          {/* 全部分类选项 */}
          <button
            type="button"
            onClick={handleShowAll}
            className={cn(
              "flex min-h-[44px] w-full touch-manipulation items-center gap-2 rounded-md px-2.5 py-2.5 text-left text-sm transition-colors sm:min-h-[36px] sm:px-3 sm:py-2",
              !currentSelectedCategory
                ? "bg-primary font-medium text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground active:bg-muted/80"
            )}
          >
            <Folder className="h-3.5 w-3.5" />
            <span className="flex-1">全部分类</span>
          </button>

          {/* 分类列表 */}
          {processedCategories.map(category => {
            const hasChildren = category.children && category.children.length > 0;
            // 修复：添加空值检查并提供默认值
            const isOpen = openCategories[category.id] ?? false;

            return (
              <div key={category.id} className="space-y-1">
                {hasChildren ? (
                  <CollapsibleCategory
                    category={category}
                    selectedCategory={currentSelectedCategory}
                    isOpen={isOpen}
                    onOpenChange={handleOpenChange}
                    onCategoryClick={handleCategoryClick}
                  />
                ) : (
                  <SimpleCategory
                    category={category}
                    selectedCategory={currentSelectedCategory}
                    onCategoryClick={handleCategoryClick}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
