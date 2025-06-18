'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useDocSidebar } from '@/hooks/use-docs';
import { NavLink } from '@/components/ui/nav-link';
import { SidebarItem } from '@/types/docs-types';

// 检查是否在客户端环境
const isBrowser = typeof window !== 'undefined';

/**
 * 侧边栏组件属性
 */
interface SidebarProps {
  /** 文档分类名称 */
  category: string;
  /** 当前打开的文档路径 */
  currentDoc?: string;
}

/**
 * 侧边栏组件
 *
 * 用于显示文档的侧边栏导航，支持嵌套分类和高亮当前文档
 */
export function Sidebar({ category, currentDoc }: SidebarProps) {
  const pathname = usePathname();
  const { items, loading } = useDocSidebar(category);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    [localStorageKey]
  );

  // 处理鼠标悬停
  const handleHover = (itemId: string | null) => {
    setIsHovering(itemId);
  };

  // 渲染侧边栏项目
  const renderItems = useCallback(
    (items: SidebarItem[], level: number = 0, parentPath: string = '') => {
      return items.map((item, index) => {
        const itemId = parentPath ? `${parentPath}-${index}` : `${index}`;
        const hasItems = item.items && item.items.length > 0;

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
                <Collapsible.Root
                  open={openCategories[itemId]}
                  onOpenChange={(open: boolean) => handleOpenChange(itemId, open)}
                >
                  <div className="flex items-center">
                    <Collapsible.Trigger className="flex items-center justify-between w-full py-2 px-3 rounded-md text-sm group hover:bg-accent/50 transition-colors">
                      <span
                        className={cn(
                          'font-medium',
                          isHovering === itemId ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="ml-1 text-muted-foreground">
                        <ChevronRight
                          className={cn('h-4 w-4', openCategories[itemId] && 'rotate-90')}
                        />
                      </span>
                    </Collapsible.Trigger>
                  </div>
                  <Collapsible.Content>
                    <ul className="mt-2 space-y-2 pl-4 pt-1 border-l border-border/40 ml-2">
                      {renderItems(item.items || [], level + 1, itemId)}
                    </ul>
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
            ) : (
              <NavLink
                href={item.href || '#'}
                currentDoc={currentDoc}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
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
    [openCategories, isHovering, handleOpenChange, currentDoc]
  );

  // 使用 React.memo 包装渲染函数，避免不必要的重新渲染
  const MemoizedSidebarItems = useMemo(() => {
    if (loading) return null;
    if (items.length === 0) return null;

    return renderItems(items);
  }, [items, loading, renderItems]);

  // 递归函数，用于设置初始折叠状态
  const setInitialState = useCallback(
    (items: SidebarItem[], parentPath: string = '', result: Record<string, boolean> = {}) => {
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
    },
    []
  );

  // 递归函数，用于查找当前文档并打开其路径
  const findAndOpenPath = useCallback(
    (
      items: SidebarItem[],
      pathname: string,
      parentPath: string = '',
      result: Record<string, boolean> = {}
    ) => {
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
    },
    []
  );

  // 初始化打开的分类
  useEffect(() => {
    // 尝试从 localStorage 中读取保存的状态（仅在客户端）
    let savedState: Record<string, boolean> = {};
    if (isBrowser) {
      const savedStateStr = localStorage.getItem(localStorageKey);
      if (savedStateStr) {
        savedState = JSON.parse(savedStateStr);
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
  if (loading || items.length === 0) {
    return null;
  }

  return (
    <div ref={sidebarRef} className="scrollbar-hide">
      <div>
        <ul className="space-y-1">{MemoizedSidebarItems}</ul>
      </div>
    </div>
  );
}
