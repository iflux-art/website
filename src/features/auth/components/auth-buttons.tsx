"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();
  const [open, setOpen] = useState(false);

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

    // 如果用户已登录，显示退出确认对话框
    if (isSignedIn) {
      return (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" title="退出登录">
              <User className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认退出登录</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要退出登录吗？退出后需要重新登录才能访问您的账户。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <SignOutButton>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </AlertDialogAction>
              </SignOutButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
