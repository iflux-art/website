"use client";

import { Button } from "@/components/ui/button";
import type { NotFoundProps } from "@/types";
import { AlertCircle, ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";
import { useId } from "react";

const DEFAULT_TEXTS = {
  code: "404",
  title: "页面未找到",
  description: "抱歉，您访问的页面不存在或已被移除。",
  buttonText: "返回首页",
  backUrl: "/",
} as const;

/**
 * 通用的NotFound错误页面组件
 * 支持自定义错误信息、操作按钮和样式
 */
export const NotFound = ({
  code = DEFAULT_TEXTS.code,
  title = DEFAULT_TEXTS.title,
  description = DEFAULT_TEXTS.description,
  buttonText = DEFAULT_TEXTS.buttonText,
  backUrl = DEFAULT_TEXTS.backUrl,
  className = "",
  showIcon = true,
}: NotFoundProps) => {
  const errorTitleId = useId();

  return (
    <main
      className={`container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-20 text-center ${className}`}
    >
      <section aria-labelledby={errorTitleId} className="w-full max-w-4xl">
        <div className="flex flex-col items-center space-y-8">
          {showIcon && (
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <AlertCircle className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
          )}

          <h1 id={errorTitleId} className="text-9xl font-bold text-primary">
            {code}
          </h1>

          <hr className="mx-auto my-6 h-0.5 w-full max-w-md bg-muted" />

          <h2 className="mb-4 text-3xl font-bold">{title}</h2>

          <p className="mx-auto mb-8 max-w-md text-lg text-muted-foreground">{description}</p>

          {/* 主要操作按钮 */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href={backUrl} className="flex items-center gap-2">
                <Home className="h-4 w-4" aria-hidden="true" />
                {buttonText}
              </Link>
            </Button>

            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              返回上页
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/search" className="flex items-center gap-2">
                <Search className="h-4 w-4" aria-hidden="true" />
                全局搜索
              </Link>
            </Button>
          </div>

          {/* 帮助信息 */}
          <div className="mt-8">
            <p className="text-sm text-muted-foreground">
              如果您认为这是一个错误，请联系网站管理员。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
