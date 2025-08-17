"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/features/ui";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { SearchButton } from "@/features/search";

type MobileMenuProps = {
  isOpen: boolean;
  setIsOpenAction: (open: boolean) => void;
};

export function MobileMenu({ isOpen, setIsOpenAction }: MobileMenuProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <div>
        <SearchButton />
      </div>
      <div>
        <ThemeToggle />
      </div>

      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpenAction}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={isOpen ? "关闭菜单" : "打开菜单"}
              title={isOpen ? "关闭菜单" : "打开菜单"}
              onClick={() => setIsOpenAction(!isOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full border-none p-0 lg:hidden"
          >
            <SheetTitle className="sr-only">导航菜单</SheetTitle>

            <div className="sticky top-0 z-40 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto flex h-full items-center justify-between px-4">
                <div className="flex items-center">
                  <Logo />
                </div>

                <div className="flex-1"></div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <div>
                    <SearchButton />
                  </div>
                  <div>
                    <ThemeToggle />
                  </div>

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
