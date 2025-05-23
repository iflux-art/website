'use client';

import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { TravelButton } from '@/components/ui/travel-button';
import { Logo } from '@/components/logo';
import { NavCards } from './nav-cards';
import { SearchIcon } from './search-icon';

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
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * 移动端菜单组件
 * 负责移动端导航和功能按钮的展示
 */
export function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* 功能按钮 */}
      <div className="md:hidden">
        <SearchIcon />
      </div>
      <div>
        <ThemeToggle />
      </div>
      <div>
        <TravelButton />
      </div>

      {/* 移动端菜单 */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
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

                  {/* X按钮 - 与汉堡菜单位置完全一致 */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setIsOpen(false)}
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
                <NavCards onClose={() => setIsOpen(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
