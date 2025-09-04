"use client";

import { NAV_DESCRIPTIONS, NAV_ITEMS, NAV_PATHS } from "./nav-config";
import { useActiveSection } from "@/features/navbar/hooks/use-active-section";
import { cn } from "@/utils";
import type { LucideIcon } from "lucide-react";
import { PrefetchLink } from "@/components/prefetch-link";

interface NavProps {
  /**
   * 点击后的回调函数（用于关闭移动菜单）
   */
  onClose?: () => void;

  /**
   * 自定义类名
   */
  className?: string;
}

const NavCards = ({ onClose, className }: NavProps) => {
  const isActiveSection = useActiveSection(
    NAV_ITEMS.map((item: (typeof NAV_ITEMS)[number]) => item.key)
  );

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {NAV_ITEMS.map((item: (typeof NAV_ITEMS)[number]) => {
          const Icon: LucideIcon = item.icon;
          // 修复：添加空值检查并提供默认值
          const href = NAV_PATHS[item.key] ?? "/";
          return (
            <PrefetchLink
              key={item.key}
              href={href}
              prefetchStrategy="hover"
              prefetchDelay={150}
              onClick={onClose}
              className={cn(
                "group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors duration-300 hover:bg-accent hover:text-accent-foreground",
                isActiveSection === item.key
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <h3 className="text-base font-medium">{item.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{NAV_DESCRIPTIONS[item.key]}</p>
              </div>
            </PrefetchLink>
          );
        })}
      </div>
    </div>
  );
};

export const NavCardMenu = ({ onClose, className }: NavProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <NavCards onClose={onClose} />
    </div>
  );
};
