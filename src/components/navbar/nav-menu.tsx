"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, NAV_DESCRIPTIONS, NAV_PATHS } from "@/config/nav-config";
import { useUser } from "@clerk/nextjs";
import { useActiveSection } from "@/hooks/ui/use-active-section";
import { AdminMenu as AdminMenuComponent } from "@/features/admin/components";
// import { HoverDropdown, HoverDropdownItem } from "@/components/ui/hover-dropdown";
import { ChevronDown } from "lucide-react";

type NavProps = {
  /**
   * 点击后的回调函数（用于关闭移动菜单）
   */
  onClose?: () => void;

  /**
   * 自定义类名
   */
  className?: string;
};

type NavMenuProps = NavProps & {
  /**
   * 显示模式：links 为链接列表，cards 为卡片模式
   */
  mode: "links" | "cards";
};

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
          className="w-full transition-all duration-300 lg:w-auto"
        >
          {"children" in item && item.children && item.children.length > 0 ? (
            // 有子菜单的项目使用内联悬浮下拉菜单
            <div className="group relative">
              <div
                className={cn(
                  "flex cursor-pointer items-center gap-1 rounded-md px-1 py-2 transition-colors duration-300 hover:bg-accent/20 lg:py-0",
                  isActiveSection === item.key
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary",
                )}
              >
                {item.label}
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </div>

              {/* 内联悬浮下拉菜单 */}
              <div
                className="invisible absolute top-full left-0 mt-2 min-w-[8rem] rounded-md border border-border bg-popover p-1 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100"
                style={{ zIndex: 9999 }}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.key}
                    href={NAV_PATHS[child.key]}
                    onClick={onClose}
                    className="block rounded-sm px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // 没有子菜单的项目使用普通链接
            <Link
              href={NAV_PATHS[item.key]}
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
          )}
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
        <div key={item.key} className="space-y-2">
          {"children" in item && item.children && item.children.length > 0 ? (
            // 有子菜单的项目显示为卡片组
            <>
              <div
                className={cn(
                  "group relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300",
                  isActiveSection === item.key
                    ? "border-primary/50 bg-primary/5"
                    : "border-border",
                )}
              >
                <div className="space-y-2">
                  <h3
                    className={cn(
                      "text-lg font-semibold transition-colors",
                      isActiveSection === item.key
                        ? "text-primary"
                        : "text-foreground",
                    )}
                  >
                    {item.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {NAV_DESCRIPTIONS[item.key]}
                  </p>
                </div>
                <div
                  className={cn(
                    "absolute -top-4 -right-4 h-16 w-16 rounded-full opacity-10 transition-all duration-300 sm:h-20 sm:w-20",
                    isActiveSection === item.key ? "bg-primary" : "bg-primary",
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                {item.children.map((child) => (
                  <Link
                    key={child.key}
                    href={NAV_PATHS[child.key]}
                    onClick={onClose}
                    className="group rounded-lg border bg-card/50 p-3 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-foreground group-hover:text-primary">
                        {child.label}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {NAV_DESCRIPTIONS[child.key]}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            // 没有子菜单的项目使用普通卡片
            <Link
              href={NAV_PATHS[item.key]}
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
                  {NAV_DESCRIPTIONS[item.key]}
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
          )}
        </div>
      ))}
    </div>
  );
}

export function NavMenu({ mode, onClose, className }: NavMenuProps) {
  const { isSignedIn } = useUser();

  if (mode === "links") {
    return <NavLinks onClose={onClose} className={className} />;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <NavCards onClose={onClose} />
      {isSignedIn && <AdminMenuComponent onClose={onClose} />}
    </div>
  );
}
