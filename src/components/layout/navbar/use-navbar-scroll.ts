'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { throttle } from 'lodash';
import { ScrollHandler, ThrottledScrollHandler } from '@/types/hooks-internal';

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
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [pageTitle, setPageTitle] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const lastScrollYRef = useRef(0);
  const pathname = usePathname();

  const scrollToTop = useCallback(() => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      console.error('Failed to scroll to top:', error);
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, []);

  const THROTTLE_DELAY = 200;

  const handleScroll: ScrollHandler = useCallback(() => {
    try {
      const currentScrollY = window.scrollY;
      const lastScroll = lastScrollYRef.current;
      const direction = currentScrollY > lastScroll ? 'down' : 'up';

      // 只有在滚动距离超过阈值时才更新方向
      if (Math.abs(currentScrollY - lastScroll) > 10) {
        setScrollDirection(direction);
        lastScrollYRef.current = currentScrollY;
      }

      // 根据滚动位置和方向决定是否显示标题
      const shouldShowTitle = currentScrollY > 100 && direction === 'down';
      setShowTitle(shouldShowTitle);
    } catch (error) {
      console.error('Error handling scroll:', error);
    }
  }, []);

  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, THROTTLE_DELAY) as ThrottledScrollHandler,
    [handleScroll]
  );

  useEffect(() => {
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      throttledHandleScroll.cancel();
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [throttledHandleScroll]);

  // 根据路径设置页面标题
  const updatePageTitle = useCallback(() => {
    const timeoutId = setTimeout(() => {
      try {
        const h1Element = document.querySelector('h1');
        if (h1Element) {
          setPageTitle(h1Element.textContent?.trim() || '');
          return;
        }

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

        setPageTitle(titleMap[pathSegments[0]] || '页面');
      } catch (error) {
        console.error('Error updating page title:', error);
        setPageTitle('页面');
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    const cleanup = updatePageTitle();
    return cleanup;
  }, [updatePageTitle]);

  return {
    scrollDirection,
    pageTitle,
    showTitle,
    scrollToTop,
  } as const;
}

export type NavbarScrollHookResult = ReturnType<typeof useNavbarScroll>;
