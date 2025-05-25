'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/layout/navbar/theme-toggle';
import { TravelButton } from '@/components/layout/navbar/travel-button';
import { Logo } from '@/components/layout/navbar/logo';
import { NavMenu } from './nav-menu';
import { SearchIcon } from './search-icon';
import { LoginDialog } from '@/components/auth/login-dialog';
import { User } from 'lucide-react';

/**
 * 移动端菜单组件属性接口
 */
export interface MobileMenuProps {
  /**
   * 菜单是否打开
   */
  isOpen: boolean;

  /**
   * 设置菜单打开状态的函数
   */
  setIsOpenAction: (isOpen: boolean) => void;
}

/**
 * 移动端菜单组件
 * 负责移动端导航和功能按钮的展示
 */
export function MobileMenu({ isOpen, setIsOpenAction }: MobileMenuProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn');
      const loginTime = localStorage.getItem('loginTime');

      if (loggedIn === 'true' && loginTime) {
        // 检查登录是否过期（24小时）
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const isExpired = now - loginTimestamp > 24 * 60 * 60 * 1000;

        if (!isExpired) {
          setIsLoggedIn(true);
        }
      }
    };

    checkAuth();

    // 监听存储变化
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* 功能按钮 */}
      <div>
        <SearchIcon />
      </div>
      <div>
        <ThemeToggle />
      </div>
      <div>
        <TravelButton />
      </div>
      <div>
        <LoginDialog>
          <Button variant="ghost" size="icon" aria-label="管理员登录" title="管理员登录">
            <User className="h-5 w-5" />
          </Button>
        </LoginDialog>
      </div>

      {/* 移动端菜单 */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpenAction}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={isOpen ? '关闭菜单' : '打开菜单'}
              title={isOpen ? '关闭菜单' : '打开菜单'}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="fullscreen" className="lg:hidden p-0 border-none">
            {/* 添加 SheetTitle 以满足无障碍性要求，但使用 sr-only 类隐藏它 */}
            <SheetTitle className="sr-only">导航菜单</SheetTitle>

            {/* 复刻导航栏样式 */}
            <div className="w-full h-16 sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* 左侧部分 - Logo */}
                <div className="flex items-center">
                  <Logo />
                </div>

                {/* 中间部分 - 空白 */}
                <div className="flex-1"></div>

                {/* 右侧部分 - 功能按钮和关闭按钮 */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* 功能按钮 */}
                  <div>
                    <SearchIcon />
                  </div>
                  <div>
                    <ThemeToggle />
                  </div>
                  <div>
                    <TravelButton />
                  </div>
                  <div>
                    <LoginDialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="管理员登录"
                        title="管理员登录"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </LoginDialog>
                  </div>

                  {/* X按钮 - 与汉堡菜单位置完全一致 */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setIsOpenAction(false)}
                    aria-label="关闭菜单"
                    title="关闭菜单"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 菜单内容 */}
            <div className="flex-1 overflow-auto p-8">
              <div className="container mx-auto flex flex-col gap-8">
                <NavMenu mode="cards" onClose={() => setIsOpenAction(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
