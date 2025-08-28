"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { Calendar, LogOut, Mail, User } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";

// 加载状态组件
const LoadingState = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="text-center">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      <p className="text-muted-foreground">加载中...</p>
    </div>
  </div>
);

// 未登录状态组件
const UnauthenticatedState = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="w-full max-w-md rounded-lg border border-border bg-card p-4 text-center">
      <h2 className="mb-2 text-xl font-bold">未登录</h2>
      <p className="mb-4 text-muted-foreground">请先登录以查看个人资料</p>
      <Link href="/sign-in">
        <Button className="w-full">前往登录</Button>
      </Link>
    </div>
  </div>
);

// 用户信息卡片组件
interface UserInfoCardProps {
  user: {
    imageUrl?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    primaryEmailAddress?: {
      emailAddress?: string | null;
    } | null;
    createdAt?: Date | null;
  };
  fullName: string;
  initials: string;
}

export const UserInfoCard = ({ user, fullName, initials }: UserInfoCardProps) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user.imageUrl || undefined} alt={fullName} />
        <AvatarFallback className="text-lg">
          {initials || <User className="h-8 w-8" />}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold">{fullName ?? user.username ?? "用户"}</h3>
        <div className="flex items-center text-muted-foreground">
          <Mail className="mr-2 h-4 w-4" />
          {user.primaryEmailAddress?.emailAddress}
        </div>
        {user.createdAt && (
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            注册于 {new Date(user.createdAt).toLocaleDateString("zh-CN")}
          </div>
        )}
      </div>
    </div>
  </div>
);

// 账户详情组件
interface AccountDetailsCardProps {
  user: {
    id: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    primaryEmailAddressId: string | null;
    emailAddresses: {
      id: string;
      emailAddress: string;
      verification?: {
        status: string | null;
      } | null;
    }[];
    externalAccounts: {
      id: string;
      provider: string;
      emailAddress?: string | null;
    }[];
  };
}

export const AccountDetailsCard = ({ user }: AccountDetailsCardProps) => {
  // 生成唯一 ID
  const userId = useId();
  const usernameId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const emailAddressesId = useId();
  const externalAccountsId = useId();

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-lg font-semibold">账户详情</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={userId} className="text-sm font-medium text-muted-foreground">
              用户ID
            </label>
            <p id={userId} className="font-mono text-sm">
              {user.id}
            </p>
          </div>
          <div>
            <label htmlFor={usernameId} className="text-sm font-medium text-muted-foreground">
              用户名
            </label>
            <p id={usernameId}>{user.username ?? "未设置"}</p>
          </div>
          <div>
            <label htmlFor={firstNameId} className="text-sm font-medium text-muted-foreground">
              名字
            </label>
            <p id={firstNameId}>{user.firstName ?? "未设置"}</p>
          </div>
          <div>
            <label htmlFor={lastNameId} className="text-sm font-medium text-muted-foreground">
              姓氏
            </label>
            <p id={lastNameId}>{user.lastName ?? "未设置"}</p>
          </div>
        </div>

        <Separator />

        <div>
          <label htmlFor={emailAddressesId} className="text-sm font-medium text-muted-foreground">
            邮箱地址
          </label>
          <div className="mt-2 space-y-2">
            {user.emailAddresses.map(
              (email: {
                id: string;
                emailAddress: string;
                verification?: { status: string | null } | null;
              }) => (
                <div key={email.id} className="flex items-center justify-between">
                  <span>{email.emailAddress}</span>
                  <div className="flex gap-2">
                    {user.primaryEmailAddressId && email.id === user.primaryEmailAddressId && (
                      <Badge variant="default">主要</Badge>
                    )}
                    <Badge
                      variant={
                        email.verification?.status === "verified" ? "secondary" : "destructive"
                      }
                    >
                      {email.verification?.status === "verified" ? "已验证" : "未验证"}
                    </Badge>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {user.externalAccounts.length > 0 && (
          <>
            <Separator />
            <div>
              <label
                htmlFor={externalAccountsId}
                className="text-sm font-medium text-muted-foreground"
              >
                关联账户
              </label>
              <div className="mt-2 space-y-2">
                {user.externalAccounts.map(
                  (account: { id: string; provider: string; emailAddress?: string | null }) => (
                    <div key={account.id} className="flex items-center justify-between">
                      <span className="capitalize">{account.provider}</span>
                      <Badge variant="outline">{account.emailAddress ?? ""}</Badge>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 操作按钮组件
export const ActionCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-lg font-semibold">账户操作</h3>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
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
    </div>
  );
};

export const UserProfile = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingState />;
  }

  if (!user) {
    return <UnauthenticatedState />;
  }

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-4">
      <UserInfoCard user={user} fullName={fullName} initials={initials} />
      <AccountDetailsCard user={user} />
      <ActionCard />
    </div>
  );
};
