'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[70vh] py-20 px-4 text-center">
      <div>
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <div className="w-full h-0.5 bg-muted my-6 max-w-md mx-auto"></div>
        <h2 className="text-3xl font-bold mb-4">页面未找到</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在或已被移除。请检查网址是否正确，或返回首页继续浏览。
        </p>
        <Button asChild>
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            返回首页
          </Link>
        </Button>
      </div>
    </div>
  );
}
