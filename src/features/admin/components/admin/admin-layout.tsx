"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// 内联管理员布局相关类型定义
interface AdminLayoutProps {
  children: ReactNode;
}

// 内联认证相关工具函数
const AUTH_STORAGE_KEYS = {
  IS_LOGGED_IN: "isLoggedIn",
  LOGIN_TIME: "loginTime",
} as const;

const AUTH_CONFIG = {
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24小时
} as const;

/**
 * 检查认证状态
 */
function checkAuthStatus(): { isValid: boolean; shouldRedirect: boolean } {
  if (typeof window === "undefined") {
    return { isValid: false, shouldRedirect: false };
  }

  const loggedIn = localStorage.getItem(AUTH_STORAGE_KEYS.IS_LOGGED_IN);
  const loginTime = localStorage.getItem(AUTH_STORAGE_KEYS.LOGIN_TIME);

  if (loggedIn !== "true" || !loginTime) {
    return { isValid: false, shouldRedirect: true };
  }

  // 检查登录是否过期
  const now = Date.now();
  const loginTimestamp = parseInt(loginTime);
  const isExpired = now - loginTimestamp > AUTH_CONFIG.SESSION_DURATION;

  if (isExpired) {
    // 清除过期的认证信息
    localStorage.removeItem(AUTH_STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.LOGIN_TIME);
    return { isValid: false, shouldRedirect: true };
  }

  return { isValid: true, shouldRedirect: false };
}

/**
 * 执行登出操作
 */
function performLogout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.LOGIN_TIME);
  }
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 检查登录状态
  useEffect(() => {
    const { isValid, shouldRedirect } = checkAuthStatus();

    if (shouldRedirect) {
      router.push("/");
    } else if (isValid) {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleLogout = () => {
    performLogout();
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
        <div className="container mx-auto py-8">
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
