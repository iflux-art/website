"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export function AuthButtons() {
  const { isSignedIn, user, isLoaded } = useUser();
  try {
    // 如果 Clerk 还在加载中，显示登录图标
    if (!isLoaded) {
      return (
        <Link href="/sign-in">
          <Button variant="ghost" size="icon" title="登录">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      );
    }

    // 如果用户已登录，显示用户菜单
    if (isSignedIn) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="账户菜单">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm font-medium">
              {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                个人资料
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                管理后台
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <SignOutButton>
                <button type="button" className="flex w-full items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </button>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // 如果用户未登录，显示登录图标
    return (
      <Link href="/sign-in">
        <Button variant="ghost" size="icon" title="登录">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    );
  } catch (error) {
    // 如果 Clerk 出现错误，显示基本的登录图标
    console.error("Clerk error:", error);
    return (
      <Link href="/sign-in">
        <Button variant="ghost" size="icon" title="登录">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    );
  }
}
