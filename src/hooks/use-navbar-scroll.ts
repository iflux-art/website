'use client';

import { useReducer, useEffect, useCallback, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { throttle } from 'lodash';
import { ThrottledScrollHandler } from '@/types/hooks-internal';

interface ScrollState {
  direction: 'up' | 'down';
  position: number;
  showTitle: boolean;
  pageTitle: string;
}

type ScrollAction = { type: 'SCROLL'; payload: number } | { type: 'SET_TITLE'; payload: string };

const SCROLL_THRESHOLD = 10;
const THROTTLE_DELAY = 300;

const initialState: ScrollState = {
  direction: 'up',
  position: 0,
  showTitle: false,
  pageTitle: '',
};

function scrollReducer(state: ScrollState, action: ScrollAction): ScrollState {
  switch (action.type) {
    case 'SCROLL': {
      const newPosition = action.payload;
      if (Math.abs(newPosition - state.position) <= SCROLL_THRESHOLD) {
        return state;
      }
      return {
        ...state,
        direction: newPosition > state.position ? 'down' : 'up',
        position: newPosition,
        showTitle: newPosition > 100,
      };
    }
    case 'SET_TITLE':
      return {
        ...state,
        pageTitle: action.payload,
      };
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

  const handleScroll = useCallback(() => {
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
      const titleMap: Record<string, string> = {
        '': '首页',
        docs: pathSegments.length === 1 ? '文档中心' : '文档',
        blog:
          pathSegments.length === 1
            ? '博客'
            : pathSegments[1] === 'timeline'
              ? '博客时间轴'
              : '博客文章',
        navigation: '网址导航',
        friends: '友情链接',
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
