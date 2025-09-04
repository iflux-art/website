"use client";

import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useNavbarScroll } from "@/features/navbar/hooks/use-navbar-scroll";
import { Logo } from "./logo";
import { NavListMenu } from "./nav-menu";

// 动态导入搜索按钮组件
const SearchButton = dynamic(
  () => import("@/features/search/components/search-button").then(mod => mod.SearchButton),
  { ssr: false }
);

// 动态导入汉堡菜单组件
const HamburgerMenu = dynamic(() => import("./hamburger-menu").then(mod => mod.HamburgerMenu), {
  ssr: false,
});

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
          {shouldShowPageTitle && showTitle ? (
            <button
              className="max-w-md cursor-pointer truncate text-lg font-medium tracking-tight hover:text-primary"
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
