'use client';

import { useState } from 'react';
import { Logo } from '@/components/layout/navbar/logo';
import { MobileMenu } from './mobile-menu';
import { NavMenu } from './nav-menu';
import { useNavbarScroll } from '@/hooks/use-navbar-scroll';

/**
 * 主导航栏组件
 * 负责整体导航布局和响应式处理
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export function Navbar({ className = '' }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { pageTitle, showTitle, scrollToTop } = useNavbarScroll();

  return (
    <nav
      className={`w-full h-16 sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
      onDoubleClick={scrollToTop}
      title={showTitle ? '双击返回顶部' : ''}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* 左侧部分 - Logo */}
        <div className="flex items-center opacity-100">
          <Logo />
        </div>

        {/* 居中部分 - 桌面导航或页面标题 */}
        <div className="hidden lg:flex items-center justify-center overflow-hidden opacity-100">
          {showTitle ? (
            <h2
              className="text-lg font-medium tracking-tight truncate max-w-md cursor-pointer transition-colors hover:text-primary"
              onClick={scrollToTop}
              title="点击返回顶部"
            >
              {pageTitle}
            </h2>
          ) : (
            <NavMenu mode="links" />
          )}
        </div>

        {/* 右侧部分 - 搜索图标和移动菜单 */}
        <div className="flex items-center gap-2">
          <MobileMenu isOpen={isOpen} setIsOpenAction={setIsOpen} />
        </div>
      </div>
    </nav>
  );
}