"use client";

import Link from "next/link";
import { cn } from "packages/utils";
import {
  NAV_ITEMS,
  NAV_DESCRIPTIONS,
  NAV_PATHS,
} from "packages/config/nav-config";
import { useAuthState } from "packages/hooks/admin/use-auth-state";
import { useActiveSection } from "packages/hooks/ui/use-active-section";
import { AdminMenu as AdminMenuComponent } from "packages/ui/components/admin/admin-menu";
import type { NavProps, NavMenuProps } from "packages/types/nav-types";

function NavLinks({ onClose, className }: NavProps) {
  const isActiveSection = useActiveSection(NAV_ITEMS.map((item) => item.key));

  return (
    <ul
      className={cn(
        "flex flex-col items-start gap-6 text-base font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-sm",
        className,
      )}
    >
      {NAV_ITEMS.map((item) => (
        <li
          key={item.key}
          className="w-full transition-all duration-300 hover:scale-105 active:scale-95 lg:w-auto"
        >
          <Link
            href={NAV_PATHS[item.key as keyof typeof NAV_PATHS]}
            className={cn(
              "block rounded-md px-1 py-2 transition-colors duration-300 hover:bg-accent/20 lg:py-0",
              isActiveSection === item.key
                ? "text-primary"
                : "text-muted-foreground hover:text-primary",
            )}
            onClick={onClose}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function NavCards({ onClose, className }: NavProps) {
  const isActiveSection = useActiveSection(NAV_ITEMS.map((item) => item.key));

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.key}
          href={NAV_PATHS[item.key as keyof typeof NAV_PATHS]}
          onClick={onClose}
          className={cn(
            "group relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
            isActiveSection === item.key
              ? "border-primary/50 bg-primary/5"
              : "border-border hover:border-primary/30",
          )}
        >
          <div className="space-y-2">
            <h3
              className={cn(
                "text-lg font-semibold transition-colors",
                isActiveSection === item.key
                  ? "text-primary"
                  : "text-foreground group-hover:text-primary",
              )}
            >
              {item.label}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {NAV_DESCRIPTIONS[item.key as keyof typeof NAV_DESCRIPTIONS]}
            </p>
          </div>
          <div
            className={cn(
              "absolute -top-4 -right-4 h-16 w-16 rounded-full opacity-10 transition-all duration-300 group-hover:scale-110 sm:h-20 sm:w-20",
              isActiveSection === item.key
                ? "bg-primary"
                : "bg-primary group-hover:opacity-20",
            )}
          />
        </Link>
      ))}
    </div>
  );
}

export function NavMenu({ mode, onClose, className }: NavMenuProps) {
  const isLoggedIn = useAuthState();

  if (mode === "links") {
    return <NavLinks onClose={onClose} className={className} />;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <NavCards onClose={onClose} />
      {isLoggedIn && <AdminMenuComponent onClose={onClose} />}
    </div>
  );
}
