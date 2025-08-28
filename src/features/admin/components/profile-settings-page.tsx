"use client";

import { UserInfoCard, AccountDetailsCard, ActionCard } from "@/features/auth/components";
import { useUser } from "@clerk/nextjs";

/**
 * 账号设置页面组件
 * 用于在管理后台中显示用户个人资料和账户设置
 */
export const ProfileSettingsPage = () => {
  const { user, isLoaded } = useUser();

  // 加载状态
  if (!isLoaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录状态
  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-4 text-center">
          <h2 className="mb-2 text-xl font-bold">未登录</h2>
          <p className="mb-4 text-muted-foreground">请先登录以查看个人资料</p>
          <a
            href="/sign-in"
            className="inline-block rounded bg-primary px-4 py-2 text-primary-foreground"
          >
            前往登录
          </a>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">账号设置</h1>
        <p className="mt-2 text-muted-foreground">管理您的个人资料和账户信息</p>
      </div>

      <UserInfoCard user={user} fullName={fullName} initials={initials} />
      <AccountDetailsCard user={user} />
      <ActionCard />
    </div>
  );
};

export default ProfileSettingsPage;
