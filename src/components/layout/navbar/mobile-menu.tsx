"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/features/theme-toggle/index";
import { SearchDialog } from "@/components/features/search";
import { Travelling } from "@/components/features/travelling";
import { NavItems } from "./nav-items";

import { hoverScale, buttonTap } from "@/lib/animations";

interface MobileMenuProps {
  isOpen: boolean;
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
      <motion.div whileHover={hoverScale} whileTap={buttonTap} className="hidden sm:block">
        <SearchDialog />
      </motion.div>
      <motion.div whileHover={hoverScale} whileTap={buttonTap}>
        <ModeToggle />
      </motion.div>
      <motion.div whileHover={hoverScale} whileTap={buttonTap} className="hidden sm:block">
        <Travelling />
      </motion.div>
      
      {/* 移动端菜单 */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80vw] sm:w-[350px] lg:hidden">
            <div className="flex flex-col gap-6 mt-8">
              <NavItems />
              <div className="flex items-center gap-2 mt-4 sm:hidden">
                <SearchDialog />
                <Travelling />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}