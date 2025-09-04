"use client";

import { NAV_ITEMS, NAV_PATHS } from "./nav-config";
import { PrefetchLink } from "@/components/prefetch-link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";

interface NavListMenuProps {
  className?: string;
}

/**
 * 导航菜单列表组件
 * 显示主要导航项
 */
export const NavListMenu = ({ className = "" }: NavListMenuProps) => {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-6", className)} aria-label="主导航">
      {NAV_ITEMS.map(item => {
        const href = NAV_PATHS[item.key] || `/${item.key}`;
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

        return (
          <PrefetchLink
            key={item.key}
            href={href}
            prefetchStrategy="hover"
            prefetchDelay={100}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </PrefetchLink>
        );
      })}
    </nav>
  );
};
