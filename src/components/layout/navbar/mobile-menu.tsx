"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { CleanSearchDialog } from "@/components/features/search/clean-search";
import { Travelling } from "@/components/features/travelling";
import { Logo } from "@/components/features/logo";
import { NavCards } from "./nav-cards";

import { hoverScale, buttonTap } from "@/lib/animations";
import { MobileMenuProps } from "./mobile-menu.types";

/**
 * 移动端菜单组件
 * 负责移动端导航和功能按钮的展示
 */
export function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* 功能按钮 */}
      <motion.div whileHover={hoverScale} whileTap={buttonTap}>
        <CleanSearchDialog />
      </motion.div>
      <motion.div whileHover={hoverScale} whileTap={buttonTap}>
        <ThemeToggle />
      </motion.div>
      <motion.div whileHover={hoverScale} whileTap={buttonTap}>
        <Travelling />
      </motion.div>

      {/* 移动端菜单 */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={isOpen ? "关闭菜单" : "打开菜单"}
              title={isOpen ? "关闭菜单" : "打开菜单"}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="fullscreen" className="lg:hidden p-0 border-none">
            {/* 复刻导航栏样式 */}
            <div className="w-full h-16 sticky top-0 z-50 backdrop-blur-md bg-background/80 shadow-sm border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300">
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
                  <motion.div whileHover={hoverScale} whileTap={buttonTap}>
                    <CleanSearchDialog />
                  </motion.div>
                  <motion.div whileHover={hoverScale} whileTap={buttonTap}>
                    <ThemeToggle />
                  </motion.div>
                  <motion.div whileHover={hoverScale} whileTap={buttonTap}>
                    <Travelling />
                  </motion.div>

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
            <div className="flex-1 overflow-auto p-6 pt-8">
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