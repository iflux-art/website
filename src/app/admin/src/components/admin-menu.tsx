"use client";

import Link from "next/link";
import { cn } from "packages/src/lib/utils";
import { ADMIN_MENU_ITEMS } from "packages/src/config/nav-config";
import { useActiveSection } from "packages/src/hooks/ui/use-active-section";
import type { NavProps } from "packages/src/types/nav-types";
import type { LucideIcon } from "lucide-react";

/**
 * 管理后台导航菜单组件
 */
export function AdminMenu({ onClose }: NavProps) {
  const isActiveSection = useActiveSection(
    ADMIN_MENU_ITEMS.map((item) => item.key),
  );

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">管理后台</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ADMIN_MENU_ITEMS.map((item) => {
          const Icon: LucideIcon = item.icon;
          return (
            <Link
              key={item.key}
              href={`/${item.key}`}
              onClick={onClose}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-card p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
                isActiveSection === item.key
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/30",
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <h4
                    className={cn(
                      "font-medium transition-colors",
                      isActiveSection === item.key
                        ? "text-primary"
                        : "text-foreground group-hover:text-primary",
                    )}
                  >
                    {item.label}
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
