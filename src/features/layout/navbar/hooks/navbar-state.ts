/**
 * 导航栏状态管理 Hook
 */

'use client';

import { useState, useCallback } from 'react';

interface NavbarState {
  direction: 'up' | 'down';
  position: number;
  showTitle: boolean;
  pageTitle: string;
  lastDirectionChange: number;
}

const STATE_CONFIG = {
  SCROLL_THRESHOLD: 3,
  SHOW_THRESHOLD: 80,
  HIDE_THRESHOLD: 120,
} as const;

export function useSafeNavbar() {
  const [state, setState] = useState<NavbarState>({
    direction: 'up',
    position: 0,
    showTitle: false,
    pageTitle: '',
    lastDirectionChange: 0,
  });

  const setScrollPosition = useCallback((position: number) => {
    setState(prev => {
      const now = Date.now();
      const newDirection = position > prev.position ? 'down' : 'up';
      const directionChanged = newDirection !== prev.direction;

      // 首页始终显示导航菜单
      if (prev.pageTitle === '首页') {
        return {
          ...prev,
          direction: newDirection,
          position,
          showTitle: false,
          lastDirectionChange: directionChanged ? now : prev.lastDirectionChange,
        };
      }

      // 忽略微小的滚动变化
      if (Math.abs(position - prev.position) <= STATE_CONFIG.SCROLL_THRESHOLD) {
        return prev;
      }

      const newState: NavbarState = {
        ...prev,
        direction: newDirection,
        position,
        lastDirectionChange: directionChanged ? now : prev.lastDirectionChange,
      };

      // 根据滚动方向和位置决定是否显示标题
      if (newDirection === 'up') {
        newState.showTitle = false; // 向上滚动始终显示菜单
      } else if (newDirection === 'down' && position > STATE_CONFIG.HIDE_THRESHOLD) {
        newState.showTitle = true; // 向下且滚动较多时收起菜单
      }

      return newState;
    });
  }, []);

  const setPageTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, pageTitle: title }));
  }, []);

  const scrollToTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return {
    ...state,
    setScrollPosition,
    setPageTitle,
    scrollToTop,
  };
}
