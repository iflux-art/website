"use client";

import { useEffect, useState } from "react";
import { GitHubButton } from "@/components/button";
import { TravelButton } from "@/components/button/travel-button";
import { ThemeToggle } from "@/features/theme";
import { Logo } from "./logo";
import { NavListMenu } from "./nav-menu";

export const MainNavbar = ({ className = "" }: { className?: string }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // 初始检查
    handleScroll();

    // 添加滚动事件监听器
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 清理事件监听器
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 h-16 w-full backdrop-blur ${className}`}
      aria-label="导航栏"
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center opacity-100">
          <Logo />
        </div>

        <div className="hidden items-center justify-center gap-8 opacity-100 lg:flex">
          <NavListMenu className="flex-1" />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <GitHubButton />
          <TravelButton />
        </div>
      </div>
      <div className="relative h-px w-full overflow-hidden">
        <div
          className={`absolute inset-x-1/2 h-px w-0 bg-border transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${
            isScrolled ? "w-full -translate-x-1/2 opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </nav>
  );
};
