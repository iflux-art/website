import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">检查您的邮箱</CardTitle>
            <CardDescription className="mt-2">
              我们已向您的邮箱发送了登录链接
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>点击邮件中的链接即可登录</p>
            <p>如果没有收到邮件，请检查垃圾邮件文件夹</p>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/auth/signin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回登录
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
