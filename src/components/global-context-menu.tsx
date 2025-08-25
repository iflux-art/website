'use client';

import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ArrowUp, Bookmark, Copy, Moon, RefreshCw, Shuffle, Sun } from 'lucide-react';
import { useGlobalContextMenu } from '../hooks/use-global-context-menu';

interface GlobalContextMenuProps {
  children: React.ReactNode;
}

/**
 * 全站右键菜单组件
 * 为所有页面提供统一的右键菜单功能
 *
 * 功能包括：
 * 1. 复制链接 - 将当前页面URL复制到剪切板
 * 2. 添加书签 - 将当前页面添加到浏览器收藏夹
 * 3. 刷新页面 - 重新载入当前页面
 * 4. 随便逛逛 - 随机跳转到项目中的其他页面
 * 5. 主题切换 - 在深色和浅色主题间切换
 * 6. 返回顶部 - 平滑滚动到页面顶部
 */
export const GlobalContextMenu = ({ children }: GlobalContextMenuProps) => {
  const {
    copyCurrentLink,
    addToBookmarks,
    refreshPage,
    randomNavigation,
    toggleTheme,
    scrollToTop,
    getThemeText,
    currentTheme,
  } = useGlobalContextMenu();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {/* 复制链接 */}
        <ContextMenuItem onClick={copyCurrentLink}>
          <Copy className="mr-2 h-4 w-4" />
          复制链接
        </ContextMenuItem>

        {/* 添加书签 */}
        <ContextMenuItem onClick={addToBookmarks}>
          <Bookmark className="mr-2 h-4 w-4" />
          添加书签
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* 刷新页面 */}
        <ContextMenuItem onClick={refreshPage}>
          <RefreshCw className="mr-2 h-4 w-4" />
          刷新页面
        </ContextMenuItem>

        {/* 随便逛逛 */}
        <ContextMenuItem onClick={randomNavigation}>
          <Shuffle className="mr-2 h-4 w-4" />
          随便逛逛
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* 主题切换 */}
        <ContextMenuItem onClick={toggleTheme}>
          {currentTheme === 'dark' ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          {getThemeText()}
        </ContextMenuItem>

        {/* 返回顶部 */}
        <ContextMenuItem onClick={scrollToTop}>
          <ArrowUp className="mr-2 h-4 w-4" />
          返回顶部
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
