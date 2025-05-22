'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DocSidebarItem } from '@/types/docs';
import { ActiveLink } from './active-link';
import { useDocOperations } from '@/lib/store/docs-store';

/**
 * 简化版文档侧边栏组件属性
 */
interface SimplifiedSidebarProps {
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
 * 简化版文档侧边栏组件
 * 
 * 使用全局状态管理，减少复杂性
 */
export function SimplifiedSidebar({ category, currentDoc }: SimplifiedSidebarProps) {
  const pathname = usePathname();
  const {
    sidebarItems,
    openCategories,
    loading,
    error,
    loadSidebar,
    toggleCategory,
    setCurrentDoc
  } = useDocOperations();
  
  // 加载侧边栏数据
  useEffect(() => {
    loadSidebar(category);
    if (currentDoc) {
      setCurrentDoc(currentDoc);
    }
  }, [category, currentDoc, loadSidebar, setCurrentDoc]);
  
  // 渲染侧边栏项目
  const renderItems = (items: DocSidebarItem[], level: number = 0, parentPath: string = '') => {
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
              <Collapsible
                open={openCategories[itemId]}
                onOpenChange={() => toggleCategory(itemId)}
              >
                <div className="flex items-center">
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-2 rounded-md text-sm group hover:bg-accent/50">
                    <span className="font-medium text-muted-foreground group-hover:text-foreground">
                      {item.title}
                    </span>
                    <span className="ml-1 text-muted-foreground">
                      <ChevronRight
                        className={cn('h-4 w-4', openCategories[itemId] && 'rotate-90')}
                      />
                    </span>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <ul className="mt-1 space-y-1 pl-3 pt-1 border-l border-border/30 ml-2">
                    {renderItems(item.items || [], level + 1, itemId)}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ) : (
            <ActiveLink
              href={item.href || '#'}
              currentDoc={currentDoc}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
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
            </ActiveLink>
          )}
        </li>
      );
    });
  };
  
  // 加载状态
  if (loading) {
    return (
      <div>
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
    return (
      <div className="text-destructive p-4 border border-destructive/50 rounded-md">
        加载文档导航失败
        <button
          onClick={() => loadSidebar(category)}
          className="mt-2 px-2 py-1 bg-muted rounded text-xs hover:bg-primary/10 hover:text-primary transition-colors"
        >
          点击重试
        </button>
      </div>
    );
  }
  
  // 如果没有项目，显示空状态
  if (sidebarItems.length === 0) {
    return (
      <div className="p-4 border border-border rounded-md text-muted-foreground">
        此分类下暂无文档
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(100vh - 7rem)' }}>
      <div>
        <ul className="space-y-1">{renderItems(sidebarItems)}</ul>
      </div>
    </div>
  );
}
