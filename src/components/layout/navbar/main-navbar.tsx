// src/components/layout/navbar/MainNavbar.tsx
"use client";

import { useState } from "react";
import { Logo } from "@/components/common/logo";
import { MobileMenu } from "@/components/layout/navbar/mobile-menu";
import { NavMenu } from "@/components/layout/navbar/nav-menu";
import { useNavbarScroll } from "@/hooks";
import { ThemeToggle } from "@/components/common/button/theme-toggle";

/**
 * 主站点导航栏组件
 * @description 网站的顶部主导航栏，负责：
 * - 展示网站 Logo
 * - 提供主要导航链接
 * - 响应式布局（桌面/移动设备）
 * - 滚动时显示当前页面标题
 * - 支持返回顶部功能
 */
export function MainNavbar({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { pageTitle, showTitle, scrollToTop } = useNavbarScroll();

  return (
    <nav
      className={`sticky top-0 z-40 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
      onDoubleClick={scrollToTop}
      title={showTitle ? "双击返回顶部" : ""}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        {/* 左侧部分 - Logo */}
        <div className="flex items-center opacity-100">
          <Logo />
        </div>

        {/* 居中部分 - 桌面导航或页面标题 */}
        <div className="hidden items-center justify-center overflow-hidden opacity-100 lg:flex">
          {showTitle ? (
            <h2
              className="max-w-md cursor-pointer truncate text-lg font-medium tracking-tight transition-colors hover:text-primary"
              onClick={scrollToTop}
              title="点击返回顶部"
            >
              {pageTitle}
            </h2>
          ) : (
            <NavMenu mode="links" />
          )}
        </div>

        {/* 右侧部分 - 搜索图标、主题切换和移动菜单 */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileMenu isOpen={isOpen} setIsOpenAction={setIsOpen} />
        </div>
      </div>
    </nav>
  );
}
