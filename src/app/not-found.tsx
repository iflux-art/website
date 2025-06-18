import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - 页面未找到',
  description: '抱歉，您访问的页面不存在或已被移除。',
};

const TEXTS = {
  title: '404',
  subtitle: '页面未找到',
  description: '抱歉，您访问的页面不存在或已被移除。请检查网址是否正确，或返回首页继续浏览。',
  button: '返回首页',
} as const;

export default function NotFound() {
  return (
    <main className="container mx-auto flex items-center justify-center min-h-[70vh] py-20 px-4 text-center">
      <section aria-labelledby="error-title">
        <h1 id="error-title" className="text-9xl font-bold text-primary">
          {TEXTS.title}
        </h1>
        <div className="w-full h-0.5 bg-muted my-6 max-w-md mx-auto" role="separator" />
        <h2 className="text-3xl font-bold mb-4">{TEXTS.subtitle}</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{TEXTS.description}</p>
        <Button asChild>
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" aria-hidden="true" />
            {TEXTS.button}
          </Link>
        </Button>
      </section>
    </main>
  );
}
