"use client";

import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { ADMIN_MENU_ITEMS } from "@/components/layout/navbar/nav-config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AdminSidebarProps {
  className?: string;
}

/**
 * 管理后台侧边栏组件
 * 显示管理功能的导航菜单
 */
export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    // 首页路径特殊处理
    if (path === "/admin" && pathname === "/admin") {
      return true;
    }
    // 其他页面路径匹配
    return path !== "/admin" && pathname.startsWith(`/${path}`);
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="p-4">
        <div className="space-y-1">
          <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">管理菜单</h3>
          <nav className="space-y-1">
            {ADMIN_MENU_ITEMS.map(item => (
              <Button
                key={item.key}
                variant={isActive(`/${item.key}`) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive(`/${item.key}`) ? "bg-secondary" : ""
                )}
                asChild
              >
                <Link href={`/${item.key}`}>
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * 管理后台侧边栏包装器
 * 使用固定宽度并支持配置选项
 */
export const AdminSidebarWrapper = ({ children }: { children?: ReactNode }) => (
  <div className="col-span-3 md:block">
    <div className="sticky top-20">
      <AdminSidebar />
      {children}
    </div>
  </div>
);
