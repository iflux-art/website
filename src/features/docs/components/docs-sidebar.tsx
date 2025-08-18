"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronRight, FileText, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { NavLink } from "@/features/layout/navbar/components/nav-link";
import { GlobalDocsStructure, DocCategoryWithDocs } from "./global-docs";
import { SidebarItem } from "@/features/docs/types";

// 检查是否在客户端环境
const isBrowser = typeof window !== "undefined";

export interface DocsSidebarProps {
  /** 全局文档结构数据 */
  structure: GlobalDocsStructure;
  /** 当前打开的文档路径 */
  currentDoc?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 文档侧边栏组件
 *
 * 显示所有文档的完整导航结构，支持跨分类的文档导航
 */
export function DocsSidebar({
  structure,
  currentDoc,
  className,
}: DocsSidebarProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 用于存储折叠状态的本地存储键
  const localStorageKey = "docs-sidebar-open-categories";

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
    (
      category: DocCategoryWithDocs & { isOpen?: boolean },
      categoryId: string,
    ) => {
      const isOpen = category.isOpen ?? openCategories[categoryId];
      const hasDocuments = category.docs.length > 0;

      return (
        <div className="mb-2">
          <Collapsible
            open={isOpen}
            onOpenChange={(open: boolean) => handleOpenChange(categoryId, open)}
          >
            <CollapsibleTrigger
              className="group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50"
              aria-expanded={isOpen}
              aria-controls={`collapsible-content-${categoryId}`}
            >
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{category.title}</span>
              </div>
              {hasDocuments && (
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200 ease-in-out",
                    isOpen && "rotate-90",
                  )}
                />
              )}
            </CollapsibleTrigger>
            {hasDocuments && (
              <CollapsibleContent
                id={`collapsible-content-${categoryId}`}
                className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden"
              >
                <div className="mt-2 ml-2 border-l border-border/40 pl-4">
                  {renderSidebarItems(category.docs, 1, categoryId)}
                </div>
              </CollapsibleContent>
            )}
          </Collapsible>
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
                <Collapsible
                  open={openCategories[itemId]}
                  onOpenChange={(open: boolean) =>
                    handleOpenChange(itemId, open)
                  }
                >
                  <div className="flex items-center">
                    <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50">
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
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="mt-2 ml-2 space-y-1 border-l border-border/40 pt-1 pl-4">
                      {renderSidebarItems(item.items || [], level + 1, itemId)}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
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

  // 渲染所有分类
  const renderAllCategories = useMemo(() => {
    return structure.categories.map((category, index) => {
      const categoryId = `category-${index}`;
      return (
        <div key={categoryId} className="mb-4">
          {renderCategoryHeader(category, categoryId)}
        </div>
      );
    });
  }, [structure.categories, openCategories, currentDoc, renderCategoryHeader]);

  // 初始化折叠状态
  useEffect(() => {
    if (isBrowser) {
      const savedStateStr = localStorage.getItem(localStorageKey);
      if (savedStateStr) {
        try {
          setOpenCategories(JSON.parse(savedStateStr));
        } catch (err) {
          console.error("Failed to parse saved state:", err);
        }
      }
    }
  }, [localStorageKey]);

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
