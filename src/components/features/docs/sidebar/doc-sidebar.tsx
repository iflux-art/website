"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, FileText, Folder } from "lucide-react";

import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useDocSidebar } from "@/hooks/use-docs";
import { DocSidebarItem } from "@/types/docs";

// 检查是否在客户端环境
const isClient = typeof window !== 'undefined';

/**
 * 文档侧边栏组件属性
 *
 * @interface DocSidebarProps
 */
interface DocSidebarProps {
  /**
   * 文档分类
   */
  category: string;

  /**
   * 当前文档
   */
  currentDoc?: string;
}

/**
 * 文档侧边栏组件
 *
 * 用于显示文档的侧边栏导航，支持嵌套分类和高亮当前文档
 *
 * @param {DocSidebarProps} props - 组件属性
 * @returns {JSX.Element} 文档侧边栏组件
 *
 * @example
 * ```tsx
 * <DocSidebar
 *   category="getting-started"
 *   currentDoc="installation"
 * />
 * ```
 */
export function DocSidebar({ category, currentDoc }: DocSidebarProps) {
  const pathname = usePathname();
  const { items, loading, error } = useDocSidebar(category);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [isHovering, setIsHovering] = useState<string | null>(null);

  // 用于存储折叠状态的本地存储键
  const localStorageKey = `docs-sidebar-${category}-open-categories`;

  // 添加调试日志
  useEffect(() => {
    console.log('DocSidebar 渲染:', {
      category,
      currentDoc,
      itemsCount: items.length,
      loading,
      error
    });
  }, [category, currentDoc, items, loading, error]);

  // 处理折叠面板打开/关闭
  const handleOpenChange = useCallback((itemId: string, open: boolean) => {
    setOpenCategories(prev => {
      const newState = { ...prev, [itemId]: open };
      // 保存到 localStorage（仅在客户端）
      if (isClient) {
        try {
          localStorage.setItem(localStorageKey, JSON.stringify(newState));
        } catch (e) {
          console.error('保存折叠状态失败:', e);
        }
      }
      return newState;
    });
  }, [localStorageKey]);

  // 处理鼠标悬停
  const handleMouseEnter = useCallback((itemId: string) => {
    setIsHovering(itemId);
  }, []);

  // 处理鼠标离开
  const handleMouseLeave = useCallback(() => {
    setIsHovering(null);
  }, []);

  // 处理内容引用
  const handleContentRef = useCallback((itemId: string, el: HTMLUListElement | null) => {
    if (el && openCategories[itemId]) {
      // 当折叠面板打开时，添加淡入效果
      setTimeout(() => {
        el.style.opacity = '1';
      }, 50);
    }
  }, [openCategories]);

  // 渲染侧边栏项目
  const renderItems = useCallback((items: DocSidebarItem[], level: number = 0, parentPath: string = '') => {
    return items.map((item, index) => {
      const itemId = parentPath ? `${parentPath}-${index}` : `${index}`;
      const hasItems = item.items && item.items.length > 0;
      const isActive = item.href ? pathname === item.href : false;
      const isSeparator = item.type === 'separator';
      const isExternal = item.isExternal;

      // 分隔符
      if (isSeparator) {
        return (
          <li key={itemId} className="my-3">
            <div className="h-px bg-border/60 w-full" />
            {item.title && (
              <div className="text-xs text-muted-foreground mt-2 px-2 uppercase font-medium">
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
              <Collapsible
                open={openCategories[itemId]}
                onOpenChange={(open) => handleOpenChange(itemId, open)}
              >
                <div className="flex items-center">
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-2 rounded-md text-sm group hover:bg-accent/50 transition-colors">
                    <span className={cn(
                      "font-medium transition-colors",
                      isHovering === itemId ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {item.title}
                    </span>
                    <span className="ml-1 text-muted-foreground transition-transform duration-200">
                      <ChevronRight
                        className={cn(
                          "h-4 w-4",
                          openCategories[itemId] && "transform rotate-90"
                        )}
                      />
                    </span>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <ul
                    className="mt-1 space-y-1 pl-3 pt-1 opacity-0 transition-opacity duration-200 border-l border-border/30 ml-2"
                    ref={(el) => handleContentRef(itemId, el)}
                  >
                    {renderItems(item.items || [], level + 1, itemId)}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ) : (
            <Link
              href={item.href || "#"}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={cn(
                "flex items-center justify-between py-2 px-2 rounded-md text-sm transition-all duration-200",
                isActive
                  ? "bg-accent/80 text-primary font-medium shadow-sm rounded-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
              onMouseEnter={() => handleMouseEnter(itemId)}
              onMouseLeave={handleMouseLeave}
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
            </Link>
          )}
        </li>
      );
    });
  }, [pathname, openCategories, isHovering, handleOpenChange, handleMouseEnter, handleMouseLeave, handleContentRef]);

  // 使用 React.memo 包装渲染函数，避免不必要的重新渲染
  const MemoizedSidebarItems = useMemo(() => {
    if (loading) return null;
    if (error) return null;
    if (items.length === 0) return null;

    return renderItems(items);
  }, [items, loading, error, renderItems]);

  // 递归函数，用于设置初始折叠状态
  const setInitialState = useCallback((items: DocSidebarItem[], parentPath: string = '', result: Record<string, boolean> = {}) => {
    items.forEach((item, index) => {
      const itemId = parentPath ? `${parentPath}-${index}` : `${index}`;

      // 如果项目有 collapsed 属性，使用它
      if (item.collapsed !== undefined) {
        result[itemId] = !item.collapsed;
      }

      // 如果有子项目，递归处理
      if (item.items && item.items.length > 0) {
        setInitialState(item.items, itemId, result);
      }
    });

    return result;
  }, []);

  // 递归函数，用于查找当前文档并打开其路径
  const findAndOpenPath = useCallback((items: DocSidebarItem[], pathname: string, parentPath: string = '', result: Record<string, boolean> = {}) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemId = parentPath ? `${parentPath}-${i}` : `${i}`;

      // 检查是否是当前文档
      if (item.href === pathname) {
        // 打开从根到当前文档的所有父级
        let currentParent = parentPath;
        while (currentParent) {
          const lastDashIndex = currentParent.lastIndexOf('-');
          if (lastDashIndex === -1) {
            result[currentParent] = true;
            break;
          }
          result[currentParent] = true;
          currentParent = currentParent.substring(0, lastDashIndex);
        }
        return true;
      }

      // 如果有子项目，递归查找
      if (item.items && item.items.length > 0) {
        const found = findAndOpenPath(item.items, pathname, itemId, result);
        if (found) {
          result[itemId] = true;
          return true;
        }
      }
    }

    return false;
  }, []);



  // 初始化打开的分类
  useEffect(() => {
    // 尝试从 localStorage 中读取保存的状态（仅在客户端）
    let savedState: Record<string, boolean> = {};
    if (isClient) {
      try {
        const savedStateStr = localStorage.getItem(localStorageKey);
        if (savedStateStr) {
          savedState = JSON.parse(savedStateStr);
          console.log('从 localStorage 读取折叠状态:', savedState);
        }
      } catch (e) {
        console.error('读取折叠状态失败:', e);
      }
    }

    // 初始化折叠状态
    const initialOpenState = setInitialState(items);

    // 如果有当前文档，确保其所在路径上的所有分类都是打开的
    if (currentDoc && pathname) {
      findAndOpenPath(items, pathname, '', initialOpenState);
    }

    // 合并保存的状态和初始状态，优先使用保存的状态
    const mergedState = { ...initialOpenState, ...savedState };

    setOpenCategories(mergedState);
  }, [items, currentDoc, pathname, setInitialState, findAndOpenPath, localStorageKey]);



  // 加载状态
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    console.error('文档侧边栏加载失败:', error);
    return (
      <div className="text-destructive p-4 border border-destructive/50 rounded-md">
        加载文档导航失败
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-2 py-1 bg-muted rounded text-xs hover:bg-primary/10 hover:text-primary transition-colors"
        >
          点击重试
        </button>
      </div>
    );
  }

  // 如果没有项目但不是因为加载中或错误，显示空状态
  if (items.length === 0 && !loading && !error) {
    console.log('文档侧边栏项目为空');
    return (
      <div className="p-4 border border-border rounded-md text-muted-foreground">
        此分类下暂无文档
      </div>
    );
  }

  return (
    <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] scrollbar-hide">
      <div>
        <ul className="space-y-1">
          {MemoizedSidebarItems}
        </ul>
      </div>
    </div>
  );
}
