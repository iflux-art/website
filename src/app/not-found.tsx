import { Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useId } from "react";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 - 页面未找到",
  description: "抱歉，您访问的页面不存在或已被移除。",
};

const DEFAULT_TEXTS = {
  code: "404",
  title: "页面未找到",
  description: "抱歉，您访问的页面不存在或已被移除。",
  buttonText: "返回首页",
  backUrl: "https://www.iflux.art/",
} as const;

/**
 * 全局404页面
 * 符合404页面设计规范，使用通用的布局和组件
 */
export default function NotFoundPage() {
  const errorTitleId = useId();
  const code = DEFAULT_TEXTS.code;
  const title = DEFAULT_TEXTS.title;
  const description = DEFAULT_TEXTS.description;
  const buttonText = DEFAULT_TEXTS.buttonText;
  const backUrl = DEFAULT_TEXTS.backUrl;

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-20 text-center">
      <section aria-labelledby={errorTitleId} className="w-full max-w-4xl">
        <div className="flex flex-col items-center space-y-8">
          <h1 id={errorTitleId} className="text-9xl font-bold text-primary">
            {code}
          </h1>

          <hr className="mx-auto my-6 h-0.5 w-full max-w-md bg-muted" />

          <h2 className="mb-4 text-3xl font-bold">{title}</h2>

          <p className="mx-auto mb-8 max-w-md text-lg text-muted-foreground">
            {description}
          </p>

          {/* 主要操作按钮 */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href={backUrl} className="flex items-center gap-2">
                <Home className="h-4 w-4" aria-hidden="true" />
                {buttonText}
              </Link>
            </Button>

            <BackButton />
          </div>
        </div>
      </section>
    </div>
  );
}