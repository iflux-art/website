'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

export function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>未登录</CardTitle>
            <CardDescription>请先登录以查看个人资料</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sign-in">
              <Button className="w-full">前往登录</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* 用户信息卡片 */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.imageUrl} alt={fullName} />
                <AvatarFallback className="text-lg">
                  {initials || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">{fullName ?? user.username ?? '用户'}</CardTitle>
                <CardDescription className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  {user.primaryEmailAddress?.emailAddress}
                </CardDescription>
                {user.createdAt && (
                  <CardDescription className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    注册于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 账户详情 */}
        <Card>
          <CardHeader>
            <CardTitle>账户详情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="userId" className="text-sm font-medium text-muted-foreground">
                  用户ID
                </label>
                <p id="userId" className="font-mono text-sm">
                  {user.id}
                </p>
              </div>
              <div>
                <label htmlFor="username" className="text-sm font-medium text-muted-foreground">
                  用户名
                </label>
                <p id="username">{user.username ?? '未设置'}</p>
              </div>
              <div>
                <label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">
                  名字
                </label>
                <p id="firstName">{user.firstName ?? '未设置'}</p>
              </div>
              <div>
                <label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">
                  姓氏
                </label>
                <p id="lastName">{user.lastName ?? '未设置'}</p>
              </div>
            </div>

            <Separator />

            <div>
              <label htmlFor="emailAddresses" className="text-sm font-medium text-muted-foreground">
                邮箱地址
              </label>
              <div className="mt-2 space-y-2">
                {user.emailAddresses.map(email => (
                  <div key={email.id} className="flex items-center justify-between">
                    <span>{email.emailAddress}</span>
                    <div className="flex gap-2">
                      {email.id === user.primaryEmailAddressId && (
                        <Badge variant="default">主要</Badge>
                      )}
                      <Badge
                        variant={
                          email.verification?.status === 'verified' ? 'secondary' : 'destructive'
                        }
                      >
                        {email.verification?.status === 'verified' ? '已验证' : '未验证'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {user.externalAccounts.length > 0 && (
              <>
                <Separator />
                <div>
                  <label
                    htmlFor="externalAccounts"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    关联账户
                  </label>
                  <div className="mt-2 space-y-2">
                    {user.externalAccounts.map(account => (
                      <div key={account.id} className="flex items-center justify-between">
                        <span className="capitalize">{account.provider}</span>
                        <Badge variant="outline">{account.emailAddress ?? ''}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 操作按钮 */}
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
      </div>
    </div>
  );
}
