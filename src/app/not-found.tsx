import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - 页面未找到",
  description: "抱歉，您访问的页面不存在或已被移除。",
};

const TEXTS = {
  title: "404",
  subtitle: "页面未找到",
  description:
    "抱歉，您访问的页面不存在或已被移除。请检查网址是否正确，或返回首页继续浏览。",
  button: "返回首页",
} as const;

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-20 text-center">
      <section aria-labelledby="error-title">
        <h1 id="error-title" className="text-9xl font-bold text-primary">
          {TEXTS.title}
        </h1>
        <div
          className="mx-auto my-6 h-0.5 w-full max-w-md bg-muted"
          role="separator"
        />
        <h2 className="mb-4 text-3xl font-bold">{TEXTS.subtitle}</h2>
        <p className="mx-auto mb-8 max-w-md text-muted-foreground">
          {TEXTS.description}
        </p>
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
