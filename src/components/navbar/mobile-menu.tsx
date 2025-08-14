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
import { ThemeToggle } from "@/components/button/theme-toggle";
import { TravelButton } from "@/components/button/travel-button";
import { Logo } from "@/components/navbar/logo";
import { NavMenu } from "@/components/navbar/nav-menu";
import { SearchButton } from "@/features/search";
import { AuthButtons } from "@/components/button/auth-buttons";

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
      <div className="hidden sm:block">
        <AuthButtons />
      </div>
      <div>
        <ThemeToggle />
      </div>
      <div>
        <TravelButton />
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
                  <div className="hidden sm:block">
                    <AuthButtons />
                  </div>
                  <div>
                    <ThemeToggle />
                  </div>
                  <div>
                    <TravelButton />
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
                <div className="sm:hidden">
                  <AuthButtons />
                </div>
                <NavMenu mode="cards" onClose={() => setIsOpenAction(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
