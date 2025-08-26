"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SearchButton } from "@/features/search";
import { useNavbarScroll } from "@/hooks/navbar/use-navbar-scroll";
import { HamburgerMenu } from "./hamburger-menu";
import { Logo } from "./logo";
import { NavListMenu } from "./nav-menu";

export const MainNavbar = ({ className = "" }: { className?: string }) => {
  const { pageTitle, showTitle, scrollToTop, shouldShowPageTitle, showNavMenu } = useNavbarScroll();

  return (
    <nav
      className={`sticky top-0 z-40 h-16 w-full border-b backdrop-blur ${className}`}
      onDoubleClickCapture={scrollToTop}
      title={showTitle ? "双击返回顶部" : ""}
      aria-label="导航栏"
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center opacity-100">
          <Logo />
        </div>

        <div className="hidden items-center justify-center gap-8 opacity-100 lg:flex">
          {shouldShowPageTitle && showTitle && !showNavMenu ? (
            <button
              className="max-w-md cursor-pointer truncate text-lg font-medium tracking-tight transition-colors hover:text-primary"
              onClick={scrollToTop}
              onKeyDown={e => e.key === "Enter" && scrollToTop()}
              title="点击返回顶部"
              tabIndex={0}
              type="button"
            >
              {pageTitle}
            </button>
          ) : null}
          {showNavMenu && <NavListMenu className="flex-1" />}
        </div>

        <div className="flex items-center gap-2">
          <SearchButton />
          <ThemeToggle />
          <HamburgerMenu />
        </div>
      </div>
    </nav>
  );
};
