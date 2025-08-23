'use client';

import { useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

// 项目中所有可访问的页面路径
const SITE_PAGES = [
  '/',
  '/blog',
  '/docs',
  '/links',
  '/friends',
  '/about',
  '/profile',
  '/admin',
] as const;

/**
 * 全站右键菜单功能Hook
 * 提供右键菜单的所有功能实现
 */
export const useGlobalContextMenu = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  // 复制当前页面链接
  const copyCurrentLink = useCallback(async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      // 这里可以添加toast通知，但项目规范限制console使用
      // 暂时使用简单的提示
    } catch {
      // 降级方案：使用传统的复制方法
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, []);

  // 添加到浏览器收藏夹
  const addToBookmarks = useCallback(() => {
    const currentTitle = document.title;

    if ('addToHomescreen' in window) {
      // PWA 添加到主屏幕
      (window as unknown as { addToHomescreen: () => void }).addToHomescreen();
    } else if (navigator.userAgent.includes('Chrome')) {
      // Chrome浏览器快捷键提示
      console.warn('请按 Ctrl+D (Windows) 或 Cmd+D (Mac) 添加书签');
    } else {
      // 通用提示
      console.warn(`请手动添加书签：${currentTitle}`);
    }
  }, []);

  // 刷新页面
  const refreshPage = useCallback(() => {
    window.location.reload();
  }, []);

  // 随机跳转到一个页面
  const randomNavigation = useCallback(() => {
    const currentPath = window.location.pathname;
    // 过滤掉当前页面
    const availablePages = SITE_PAGES.filter(page => page !== currentPath);

    if (availablePages.length > 0) {
      const randomPage = availablePages[Math.floor(Math.random() * availablePages.length)];
      router.push(randomPage);
    }
  }, [router]);

  // 主题切换
  const toggleTheme = useCallback(() => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, [setTheme, resolvedTheme]);

  // 返回页面顶部
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // 获取主题相关的显示文本
  const getThemeText = useCallback(
    () => (resolvedTheme === 'dark' ? '浅色模式' : '深色模式'),
    [resolvedTheme]
  );

  return {
    copyCurrentLink,
    addToBookmarks,
    refreshPage,
    randomNavigation,
    toggleTheme,
    scrollToTop,
    getThemeText,
    currentTheme: resolvedTheme,
  };
};
