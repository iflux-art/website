'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 导航栏滚动效果钩子
 * 
 * 提供全局的导航栏滚动行为：
 * - 向下滚动显示页面标题
 * - 向上滚动恢复导航菜单
 * - 双击导航栏回到顶部
 */
export function useNavbarScroll() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [pageTitle, setPageTitle] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const pathname = usePathname();

  // 滚动到顶部的函数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      
      // 只有在滚动距离超过阈值时才更新方向
      if (Math.abs(currentScrollY - lastScrollY) > 10) {
        setScrollDirection(direction);
        setLastScrollY(currentScrollY);
      }

      // 根据滚动位置和方向决定是否显示标题
      const shouldShowTitle = currentScrollY > 100 && direction === 'down';
      setShowTitle(shouldShowTitle);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // 根据路径设置页面标题
  useEffect(() => {
    const updatePageTitle = () => {
      // 延迟获取标题，确保页面已渲染
      setTimeout(() => {
        const h1Element = document.querySelector('h1');
        if (h1Element) {
          setPageTitle(h1Element.textContent || '');
          return;
        }

        // 如果没有 h1，根据路径设置默认标题
        const pathSegments = pathname.split('/').filter(Boolean);
        if (pathSegments.length === 0) {
          setPageTitle('首页');
        } else if (pathSegments[0] === 'docs') {
          if (pathSegments.length === 1) {
            setPageTitle('文档中心');
          } else {
            setPageTitle('文档');
          }
        } else if (pathSegments[0] === 'blog') {
          if (pathSegments.length === 1) {
            setPageTitle('博客');
          } else if (pathSegments[1] === 'timeline') {
            setPageTitle('博客时间轴');
          } else {
            setPageTitle('博客文章');
          }
        } else if (pathSegments[0] === 'navigation') {
          setPageTitle('网址导航');
        } else if (pathSegments[0] === 'friends') {
          setPageTitle('友情链接');
        } else {
          setPageTitle('页面');
        }
      }, 100);
    };

    updatePageTitle();
  }, [pathname]);

  return {
    scrollDirection,
    pageTitle,
    showTitle,
    scrollToTop,
  };
}
