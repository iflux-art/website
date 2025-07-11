"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Globe, LogOut, Home } from "lucide-react";
import type { AdminLayoutProps } from "@/types/admin-types";

const adminMenuItems = [
  {
    key: "dashboard",
    label: "仪表板",
    icon: Home,
    href: "/admin",
  },
  {
    key: "navigation",
    label: "网址管理",
    icon: Globe,
    href: "/admin/navigation",
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 检查登录状态
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      const loginTime = localStorage.getItem("loginTime");

      if (loggedIn === "true" && loginTime) {
        // 检查登录是否过期（24小时）
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const isExpired = now - loginTimestamp > 24 * 60 * 60 * 1000;

        if (isExpired) {
          handleLogout();
        } else {
          setIsLoggedIn(true);
        }
      } else {
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loginTime");
    setIsLoggedIn(false);
    router.push("/");
  };

  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">验证登录状态...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 主内容区 */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* 页面标题和导航 */}
          <div className="mb-8">
            <h1 className="mb-6 text-3xl font-bold tracking-tight">管理后台</h1>

            {/* 简化的导航 */}
            <div className="mb-6 flex items-center gap-2">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}

              {/* 退出登录按钮 */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="ml-auto"
              >
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </Button>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
