"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, NAV_PATHS } from "./navbar-config";
import type { BaseNavItem } from "./navbar-types";

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
    <nav
      className={cn("flex items-center gap-6", className)}
      aria-label="主导航"
    >
      {NAV_ITEMS.map((item: BaseNavItem) => {
        const href = NAV_PATHS[item.key] || `/${item.key}`;
        const isExternal = "external" in item && item.external;
        const isActive =
          !isExternal &&
          (pathname === href || (href !== "/" && pathname.startsWith(href)));

        if (isExternal) {
          return (
            <a
              key={item.key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                "text-muted-foreground hover:text-primary",
              )}
            >
              {item.label}
            </a>
          );
        }

        return (
          <Link
            key={item.key}
            href={href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
