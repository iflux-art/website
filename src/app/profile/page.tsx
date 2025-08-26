"use client";

import { ProgressBarLoading } from "@/components/layout";
import { PageContainer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { Calendar, LogOut, Mail, Settings, User } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useId } from "react";

// 未认证状态组件
const UnauthenticatedState = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>需要登录</CardTitle>
        <CardDescription>请先登录以查看您的个人资料</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href="/sign-in">登录</Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

// 用户信息卡片组件
interface UserInfoCardProps {
  user: {
    id: string;
    imageUrl?: string | null;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    primaryEmailAddress?: {
      emailAddress: string;
    } | null;
    createdAt?: Date | null;
  };
  fullName: string;
  initials: string;
}

const UserInfoCard = ({ user, fullName, initials }: UserInfoCardProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.imageUrl || undefined} alt={fullName} />
          <AvatarFallback className="text-lg">
            {initials || <User className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-2xl">{fullName ?? user.username ?? "用户"}</CardTitle>
          <CardDescription className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            {user.primaryEmailAddress?.emailAddress}
          </CardDescription>
          {user.createdAt && (
            <CardDescription className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              注册于 {user.createdAt.toLocaleDateString("zh-CN")}
            </CardDescription>
          )}
        </div>
      </div>
    </CardHeader>
  </Card>
);

// 账户详情卡片组件
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

const AccountDetailsCard = ({ user }: AccountDetailsCardProps) => {
  const userId = useId();
  const usernameId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const emailAddressesId = useId();
  const externalAccountsId = useId();

  return (
    <Card>
      <CardHeader>
        <CardTitle>账户详情</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};

// 操作按钮卡片组件
const ActionButtonsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>账户操作</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Link href="/admin">
        <Button variant="outline" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          管理后台
        </Button>
      </Link>

      <SignOutButton>
        <Button variant="destructive" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          退出登录
        </Button>
      </SignOutButton>
    </CardContent>
  </Card>
);

const ProfilePage = () => {
  const { user, isLoaded } = useUser();

  // 加载状态
  if (!isLoaded) {
    return <ProgressBarLoading />;
  }

  // 未登录状态
  if (!user) {
    return <UnauthenticatedState />;
  }

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <PageContainer config={{ layout: "full-width" }}>
      <div>
        {/* 个人资料内容 */}
        <div className="mx-auto max-w-2xl space-y-6">
          <UserInfoCard user={user} fullName={fullName} initials={initials} />
          <AccountDetailsCard user={user} />
          <ActionButtonsCard />
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
