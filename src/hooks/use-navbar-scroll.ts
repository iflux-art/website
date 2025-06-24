'use client';

import { useReducer, useEffect, useCallback, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { default as throttle } from 'lodash/throttle';
import { ThrottledScrollHandler } from '@/types';

const SCROLL_THRESHOLD = 3; // 更小的滚动检测阈值，使响应更灵敏
const SHOW_THRESHOLD = 80; // 略微降低显示阈值
const HIDE_THRESHOLD = 120; // 降低隐藏阈值使过渡更平滑
const THROTTLE_DELAY = 50; // 更快的节流响应

type ScrollAction = { type: 'SCROLL'; payload: number } | { type: 'SET_TITLE'; payload: string };

interface ScrollState {
  direction: 'up' | 'down';
  position: number;
  showTitle: boolean;
  pageTitle: string;
  lastDirectionChange: number; // 新增：记录最后一次方向改变的时间
}

const initialState: ScrollState = {
  direction: 'up',
  position: 0,
  showTitle: false,
  pageTitle: '',
  lastDirectionChange: 0,
};

function scrollReducer(state: ScrollState, action: ScrollAction): ScrollState {
  switch (action.type) {
    case 'SCROLL': {
      const newPosition = action.payload;
      const now = Date.now();

      // 忽略微小的滚动变化
      if (Math.abs(newPosition - state.position) <= SCROLL_THRESHOLD) {
        return state;
      }

      const newDirection = newPosition > state.position ? 'down' : 'up';
      const directionChanged = newDirection !== state.direction;

      // 首页始终显示导航菜单
      if (state.pageTitle === '首页') {
        return {
          ...state,
          direction: newDirection,
          position: newPosition,
          showTitle: false, // 首页不显示 h1 标题，仅显示菜单
          lastDirectionChange: directionChanged ? now : state.lastDirectionChange,
        };
      }

      // 在顶部区域时总是显示导航菜单
      if (newPosition < SHOW_THRESHOLD) {
        return {
          ...state,
          direction: newDirection,
          position: newPosition,
          showTitle: false, // 顶部显示菜单
          lastDirectionChange: directionChanged ? now : state.lastDirectionChange,
        };
      }

      // 向上滚动时显示导航菜单
      if (newDirection === 'up' && newPosition > HIDE_THRESHOLD) {
        return {
          ...state,
          direction: newDirection,
          position: newPosition,
          showTitle: false, // 向上滚动显示菜单
          lastDirectionChange: directionChanged ? now : state.lastDirectionChange,
        };
      }

      // 向下滚动时显示 h1 标题
      if (newDirection === 'down' && newPosition > HIDE_THRESHOLD) {
        return {
          ...state,
          direction: newDirection,
          position: newPosition,
          showTitle: true, // 向下滚动显示 h1 标题
          lastDirectionChange: directionChanged ? now : state.lastDirectionChange,
        };
      }

      // 默认保持当前状态
      return {
        ...state,
        direction: newDirection,
        position: newPosition,
        lastDirectionChange: directionChanged ? now : state.lastDirectionChange,
      };
    }
    case 'SET_TITLE': {
      return {
        ...state,
        pageTitle: action.payload,
      };
    }
    default:
      return state;
  }
}

/**
 * 导航栏滚动效果 Hook
 *
 * 根据页面滚动行为控制导航栏的显示状态，提供以下功能：
 * - 监听滚动方向，自动切换导航栏显示状态
 * - 动态获取并显示当前页面标题
 * - 提供回到顶部功能
 *
 * @returns 返回导航栏状态和控制函数对象
 */
export function useNavbarScroll() {
  const [state, dispatch] = useReducer(scrollReducer, initialState);
  const pathname = usePathname();
  const titleObserverRef = useRef<MutationObserver | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = useCallback(function (this: Window, _: Event) {
    dispatch({ type: 'SCROLL', payload: window.scrollY });
  }, []);

  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, THROTTLE_DELAY) as ThrottledScrollHandler,
    [handleScroll]
  );

  // 监听滚动事件
  useEffect(() => {
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      throttledHandleScroll.cancel();
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [throttledHandleScroll]);

  // 设置页面标题
  const updatePageTitle = useCallback(() => {
    // 清理之前的 observer
    if (titleObserverRef.current) {
      titleObserverRef.current.disconnect();
    }

    // 创建新的 observer 监听标题变化
    titleObserverRef.current = new MutationObserver(() => {
      const h1Element = document.querySelector('h1');
      if (h1Element) {
        dispatch({ type: 'SET_TITLE', payload: h1Element.textContent?.trim() || '' });
      }
    });

    // 立即获取标题
    const h1Element = document.querySelector('h1');
    if (h1Element) {
      dispatch({ type: 'SET_TITLE', payload: h1Element.textContent?.trim() || '' });
      titleObserverRef.current.observe(h1Element, {
        characterData: true,
        subtree: true,
        childList: true,
      });
    } else {
      // 如果没有 h1，根据路径设置默认标题
      const pathSegments = pathname.split('/').filter(Boolean);
      const titleMap: { [key: string]: string } = {
        '': '首页',
        docs: pathSegments.length === 1 ? '文档中心' : '文档详情',
        blog: pathSegments.length === 1 ? '博客列表' : '博客详情',
        journal: pathSegments.length === 1 ? '日志归档' : '日志详情',
        admin: '管理中心',
        tools: pathSegments.length === 1 ? '工具箱' : '工具详情',
        links: '网址导航',
      };
      dispatch({
        type: 'SET_TITLE',
        payload: titleMap[pathSegments[0]] || '页面',
      });
    }

    return () => {
      if (titleObserverRef.current) {
        titleObserverRef.current.disconnect();
      }
    };
  }, [pathname]);

  // 路径变化时更新标题
  useEffect(() => {
    const cleanup = updatePageTitle();
    return cleanup;
  }, [updatePageTitle]);

  return {
    scrollDirection: state.direction,
    pageTitle: state.pageTitle,
    showTitle: state.showTitle,
    scrollToTop,
  } as const;
}
