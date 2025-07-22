"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "packages/ui/components/shared-ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "packages/ui/components/shared-ui/sheet";
import { ThemeToggle } from "packages/ui/components/theme/theme-toggle";
import { TravelButton } from "packages/ui/components/button/travel-button";
import { Logo } from "packages/ui/components/logo";
import { NavMenu } from "packages/ui/components/navbar/nav-menu";
import { SearchIcon } from "packages/ui/components/button/search-button";
import type { MobileMenuProps } from "packages/types/nav-types";

/**
 * 移动端菜单组件
 * 负责移动端导航和功能按钮的展示
 */
export function MobileMenu({ isOpen, setIsOpenAction }: MobileMenuProps) {
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

      {/* 移动端菜单 */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpenAction}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={isOpen ? "关闭菜单" : "打开菜单"}
              title={isOpen ? "关闭菜单" : "打开菜单"}
              onClick={() => {
                console.log("汉堡按钮被点击");
              }}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="fullscreen" className="border-none p-0 lg:hidden">
            {/* 添加 SheetTitle 以满足无障碍性要求，但使用 sr-only 类隐藏它 */}
            <SheetTitle className="sr-only">导航菜单</SheetTitle>

            {/* 复刻导航栏样式 */}
            <div className="sticky top-0 z-40 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto flex h-full items-center justify-between px-4">
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
