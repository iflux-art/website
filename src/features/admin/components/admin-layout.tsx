"use client";

import { Button } from "@/components/ui/button";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, User } from "lucide-react";
import { type ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <div className="container mx-auto py-8">
          {/* 页面标题和导航 */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">管理后台</h1>
              {user && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>
                    欢迎，
                    {user.firstName ?? user.emailAddresses[0]?.emailAddress}
                  </span>
                </div>
              )}
            </div>
            <SignOutButton>
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </Button>
            </SignOutButton>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};
