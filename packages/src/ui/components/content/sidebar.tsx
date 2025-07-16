"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "packages/src/lib/utils";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useDocSidebar, SidebarItem } from "@/app/docs/src/hooks/use-docs";
import { NavLink } from "packages/src/ui/components/shared-ui/nav-link";
// 内联 SidebarProps 类型定义
export interface SidebarProps {
  /** 文档分类名称 */
  category: string;
  /** 当前打开的文档路径 */
  currentDoc?: string;
}
// 检查是否在客户端环境
const isBrowser = typeof window !== "undefined";

/**
 * 侧边栏组件
 *
 * 用于显示文档的侧边栏导航，支持嵌套分类和高亮当前文档
 */
export function Sidebar({ category, currentDoc }: SidebarProps) {
  const { items, loading } = useDocSidebar(category);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const hasDataChanged = useRef(false);

  // 用于存储折叠状态的本地存储键
  const localStorageKey = `docs-sidebar-${category}-open-categories`;

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

  // 渲染侧边栏项目
  const renderItems = useCallback(
    (items: SidebarItem[], level: number = 0, parentPath: string = "") => {
      return items.map((item, index) => {
        const itemId = parentPath ? `${parentPath}-${index}` : `${index}`;
        const hasItems = item.items && item.items.length > 0;

        const isSeparator = item.type === "separator";
        const isExternal = item.isExternal;

        // 分隔符
        if (isSeparator) {
          return (
            <li key={itemId} className="my-3">
              <div className="h-px w-full bg-border/60" />
              {item.title && (
                <div className="mt-2 px-2 text-xs font-medium text-muted-foreground uppercase">
                  {item.title}
                </div>
              )}
            </li>
          );
        }

        return (
          <li key={itemId} className="my-1">
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
                      <span className="ml-1 text-muted-foreground">
                        <ChevronRight
                          className={cn(
                            "h-4 w-4",
                            openCategories[itemId] && "rotate-90",
                          )}
                        />
                      </span>
                    </Collapsible.Trigger>
                  </div>
                  <Collapsible.Content>
                    <ul className="mt-2 ml-2 space-y-2 border-l border-border/40 pt-1 pl-4">
                      {renderItems(item.items || [], level + 1, itemId)}
                    </ul>
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
              >
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
          </li>
        );
      });
    },
    [openCategories, isHovering, handleOpenChange, currentDoc],
  );

  // 使用 React.memo 包装渲染函数，避免不必要的重新渲染
  const MemoizedSidebarItems = useMemo(() => {
    if (loading) return null;
    if (items.length === 0) return null;

    return renderItems(items);
  }, [items, loading, renderItems]);

  // 递归函数，用于设置初始折叠状态
  // 将状态初始化函数移到组件外部
  const initializeState = (
    items: SidebarItem[],
    currentDoc: string | undefined,
    parentPath: string = "",
    result: Record<string, boolean> = {},
  ) => {
    items.forEach((item, index) => {
      const itemId = parentPath ? `${parentPath}-${index}` : `${index}`;

      // 如果项目有 collapsed 属性，使用它
      if (item.collapsed !== undefined) {
        result[itemId] = !item.collapsed;
      }

      // 如果有子项目，递归处理
      if (item.items && item.items.length > 0) {
        initializeState(item.items, currentDoc, itemId, result);
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
    return result;
  };

  useEffect(() => {
    // 如果正在加载或没有数据，不进行初始化
    if (loading || !items.length) {
      return;
    }

    // 如果已经初始化过，且数据没有变化，则跳过
    if (isInitialized.current && !hasDataChanged.current) {
      return;
    }

    const initializeOpenState = () => {
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
            console.warn("Failed to parse saved sidebar state");
          }
        }
      }

      // 如果没有保存的状态，初始化新状态
      const initialState = initializeState(items, currentDoc);
      setOpenCategories(initialState);
      isInitialized.current = true;
    };

    initializeOpenState();
    hasDataChanged.current = false;
  }, [items, currentDoc, localStorageKey, loading]);

  // 添加数据变化检测
  useEffect(() => {
    if (items.length) {
      hasDataChanged.current = true;
    }
  }, [items]);

  // 加载状态
  if (loading || items.length === 0) {
    return null;
  }

  return (
    <div ref={sidebarRef} className="hide-scrollbar">
      <div>
        <ul className="space-y-1">{MemoizedSidebarItems}</ul>
      </div>
    </div>
  );
}
