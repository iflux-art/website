"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">管理后台</h1>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </Button>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
