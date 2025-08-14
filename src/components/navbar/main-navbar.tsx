"use client";

import { useState } from "react";
import { Logo } from "@/components/navbar/logo";
import { MobileMenu } from "@/components/navbar/mobile-menu";
import { NavMenu } from "@/components/navbar/nav-menu";
import { useNavbarScroll } from "@/hooks/ui/use-navbar-scroll";

export function MainNavbar({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { pageTitle, showTitle, scrollToTop } = useNavbarScroll();

  return (
    <nav
      className={`sticky top-0 z-40 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
      onDoubleClick={scrollToTop}
      title={showTitle ? "双击返回顶部" : ""}
    >
      <div className="container mx-auto flex h-full items-center justify-between">
        <div className="flex items-center opacity-100">
          <Logo />
        </div>

        <div className="hidden items-center justify-center opacity-100 lg:flex">
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

        <div className="flex items-center gap-2">
          <MobileMenu isOpen={isOpen} setIsOpenAction={setIsOpen} />
        </div>
      </div>
    </nav>
  );
}
