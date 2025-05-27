'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return '服务器配置错误，请联系管理员';
      case 'AccessDenied':
        return '访问被拒绝，您没有权限访问此资源';
      case 'Verification':
        return '验证失败，链接可能已过期或无效';
      case 'OAuthSignin':
        return '第三方登录失败，请重试';
      case 'OAuthCallback':
        return '登录回调失败，请重试';
      case 'OAuthCreateAccount':
        return '创建账户失败，请重试';
      case 'EmailCreateAccount':
        return '邮箱登录失败，请重试';
      case 'Callback':
        return '登录失败，请重试';
      case 'OAuthAccountNotLinked':
        return '该邮箱已使用其他方式注册，请使用对应的登录方式';
      case 'EmailSignin':
        return '邮件发送失败，请重试';
      case 'CredentialsSignin':
        return '登录凭据无效';
      case 'SessionRequired':
        return '需要登录才能访问此页面';
      default:
        return '登录时发生未知错误，请重试';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-2xl">登录失败</CardTitle>
            <CardDescription className="mt-2">
              {getErrorMessage(error)}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>如果问题持续存在，请联系技术支持</p>
          </div>
          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link href="/auth/signin">
                重新登录
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回首页
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
