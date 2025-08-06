"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronRight, FileText, Folder } from "lucide-react";
import { cn } from "@/utils";
import * as Collapsible from "@radix-ui/react-collapsible";
import { NavLink } from "@/components/ui/nav-link";
import { GlobalDocsStructure, DocCategoryWithDocs } from "@/lib/global-docs";
import { SidebarItem } from "@/types/docs-types";

// 检查是否在客户端环境
const isBrowser = typeof window !== "undefined";

export interface GlobalDocsSidebarProps {
  /** 全局文档结构数据 */
  structure: GlobalDocsStructure;
  /** 当前打开的文档路径 */
  currentDoc?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 全局文档侧边栏组件
 *
 * 显示所有文档的完整导航结构，支持跨分类的文档导航
 */
export function GlobalDocsSidebar({
  structure,
  currentDoc,
  className,
}: GlobalDocsSidebarProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // 用于存储折叠状态的本地存储键
  const localStorageKey = "global-docs-sidebar-open-categories";

  // 处理折叠面板打开/关闭
  const handleOpenChange = useCallback(
    (itemId: string, open: boolean) => {
      setOpenCategories((prev) => {
        const newState = { ...prev, [itemId]: open };
        // 保存到 localStorage（仅在客户端）
        if (isBrowser) {
          localStorage.setItem(localStorageKey, JSON.stringify(newState));
        }
        return newState;
      });
    },
    [localStorageKey],
  );

  // 处理鼠标悬停
  const handleHover = (itemId: string | null) => {
    setIsHovering(itemId);
  };

  // 渲染分类标题
  const renderCategoryHeader = useCallback(
    (category: DocCategoryWithDocs, categoryId: string) => {
      const isOpen = openCategories[categoryId];
      const hasDocuments = category.docs.length > 0;

      return (
        <div className="mb-2">
          <Collapsible.Root
            open={isOpen}
            onOpenChange={(open: boolean) => handleOpenChange(categoryId, open)}
          >
            <Collapsible.Trigger className="group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{category.title}</span>
              </div>
              {hasDocuments && (
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    isOpen && "rotate-90",
                  )}
                />
              )}
            </Collapsible.Trigger>
            {hasDocuments && (
              <Collapsible.Content>
                <div className="mt-2 ml-2 border-l border-border/40 pl-4">
                  {renderSidebarItems(category.docs, 1, categoryId)}
                </div>
              </Collapsible.Content>
            )}
          </Collapsible.Root>
        </div>
      );
    },
    [openCategories, handleOpenChange],
  );

  // 渲染侧边栏项目
  const renderSidebarItems = useCallback(
    (items: SidebarItem[], level: number = 0, parentPath: string = "") => {
      return items.map((item, index) => {
        const itemId = parentPath ? `${parentPath}-${index}` : `${index}`;
        const hasItems = item.items && item.items.length > 0;
        const isSeparator = item.type === "separator";
        const isExternal = item.isExternal;
        const isCurrentDoc = currentDoc && item.href === currentDoc;

        // 分隔符
        if (isSeparator) {
          return (
            <div key={itemId} className="my-3">
              <div className="h-px w-full bg-border/60" />
              {item.title && (
                <div className="mt-2 px-2 text-xs font-medium text-muted-foreground uppercase">
                  {item.title}
                </div>
              )}
            </div>
          );
        }

        return (
          <div key={itemId} className="my-1">
            {hasItems ? (
              <div>
                <Collapsible.Root
                  open={openCategories[itemId]}
                  onOpenChange={(open: boolean) =>
                    handleOpenChange(itemId, open)
                  }
                >
                  <div className="flex items-center">
                    <Collapsible.Trigger className="group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50">
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        <span
                          className={cn(
                            "font-medium",
                            isHovering === itemId
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {item.title}
                        </span>
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          openCategories[itemId] && "rotate-90",
                        )}
                      />
                    </Collapsible.Trigger>
                  </div>
                  <Collapsible.Content>
                    <div className="mt-2 ml-2 space-y-1 border-l border-border/40 pt-1 pl-4">
                      {renderSidebarItems(item.items || [], level + 1, itemId)}
                    </div>
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
            ) : (
              <NavLink
                href={item.href || "#"}
                currentDoc={currentDoc}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                onMouseEnter={() => handleHover(itemId)}
                onMouseLeave={() => handleHover(null)}
                className={cn(
                  "!flex !items-center !justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isCurrentDoc &&
                    "bg-accent font-medium text-accent-foreground",
                )}
              >
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{item.title}</span>
                {isExternal && (
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
              </NavLink>
            )}
          </div>
        );
      });
    },
    [openCategories, isHovering, handleOpenChange, currentDoc],
  );

  // 初始化折叠状态
  const initializeOpenState = useCallback(
    (categories: DocCategoryWithDocs[], currentDoc?: string) => {
      const result: Record<string, boolean> = {};

      // 为每个分类设置初始状态
      categories.forEach((category, categoryIndex) => {
        const categoryId = `category-${categoryIndex}`;

        // 默认展开第一个分类，或者包含当前文档的分类
        const shouldOpenCategory =
          categoryIndex === 0 ||
          (currentDoc ? isDocInCategory(category.docs, currentDoc) : false);

        result[categoryId] = shouldOpenCategory;

        // 递归处理分类内的文档项目
        if (category.docs.length > 0) {
          initializeSidebarItemsState(
            category.docs,
            currentDoc,
            categoryId,
            result,
          );
        }
      });

      return result;
    },
    [],
  );

  // 递归初始化侧边栏项目状态
  const initializeSidebarItemsState = (
    items: SidebarItem[],
    currentDoc: string | undefined,
    parentPath: string,
    result: Record<string, boolean>,
  ) => {
    items.forEach((item, index) => {
      const itemId = `${parentPath}-${index}`;

      // 如果项目有 collapsed 属性，使用它
      if (item.collapsed !== undefined) {
        result[itemId] = !item.collapsed;
      }

      // 如果有子项目，递归处理
      if (item.items && item.items.length > 0) {
        initializeSidebarItemsState(item.items, currentDoc, itemId, result);
      }

      // 如果是当前文档，打开其路径
      if (currentDoc && item.href === currentDoc) {
        let current = parentPath;
        while (current) {
          result[current] = true;
          const lastDash = current.lastIndexOf("-");
          if (lastDash === -1) break;
          current = current.substring(0, lastDash);
        }
      }
    });
  };

  // 检查文档是否在分类中
  const isDocInCategory = (items: SidebarItem[], docPath: string): boolean => {
    for (const item of items) {
      if (item.href === docPath) {
        return true;
      }
      if (item.items && isDocInCategory(item.items, docPath)) {
        return true;
      }
    }
    return false;
  };

  // 初始化组件状态
  useEffect(() => {
    if (!structure.categories.length || isInitialized.current) {
      return;
    }

    const initializeState = () => {
      // 尝试从 localStorage 中读取
      if (isBrowser) {
        const savedStateStr = localStorage.getItem(localStorageKey);
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

      // 如果没有保存的状态，初始化新状态
      const initialState = initializeOpenState(
        structure.categories,
        currentDoc,
      );
      setOpenCategories(initialState);
      isInitialized.current = true;
    };

    initializeState();
  }, [structure.categories, currentDoc, initializeOpenState, localStorageKey]);

  // 渲染所有分类
  const renderAllCategories = useMemo(() => {
    if (!structure.categories.length) {
      return (
        <div className="px-3 py-4 text-sm text-muted-foreground">暂无文档</div>
      );
    }

    return structure.categories.map((category, index) => {
      const categoryId = `category-${index}`;
      return (
        <div key={categoryId} className="mb-4">
          {renderCategoryHeader(category, categoryId)}
        </div>
      );
    });
  }, [structure.categories, renderCategoryHeader]);

  return (
    <div
      ref={sidebarRef}
      className={cn("hide-scrollbar", className)}
      style={{ direction: "ltr", textAlign: "left" }}
    >
      <div className="space-y-2">
        {/* 分类列表 */}
        <div className="space-y-1">{renderAllCategories}</div>
      </div>
    </div>
  );
}
