import { BackButton, Button } from "@/components";
import { PageContainer } from "@/components/layout";
import { AlertCircle, Home, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useId } from "react";

export const metadata: Metadata = {
  title: "404 - 页面未找到",
  description: "抱歉，您访问的页面不存在或已被移除。",
};

/**
 * 全局404页面
 * 符合404页面设计规范，使用通用的布局和组件
 */
const NotFoundPage = () => {
  const errorTitleId = useId();

  return (
    <PageContainer config={{ layout: "full-width" }}>
      <main className="flex min-h-[70vh] items-center justify-center text-center">
        <section aria-labelledby={errorTitleId} className="w-full max-w-4xl">
          <div className="flex flex-col items-center space-y-8">
            {/* 错误图标 */}
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <AlertCircle className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>

            {/* 404 码 */}
            <h1 id={errorTitleId} className="text-9xl font-bold text-primary">
              404
            </h1>

            {/* 分割线 */}
            <hr className="mx-auto my-6 h-0.5 w-full max-w-md bg-muted" />

            {/* 错误标题 */}
            <h2 className="mb-4 text-3xl font-bold">页面未找到</h2>

            {/* 错误描述 */}
            <p className="mx-auto mb-8 max-w-md text-lg text-muted-foreground">
              抱歉，您访问的页面不存在或已被移除。
            </p>

            {/* 主要操作按钮 */}
            <div className="mb-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" aria-hidden="true" />
                  返回首页
                </Link>
              </Button>

              <BackButton />

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
    </PageContainer>
  );
};

export default NotFoundPage;
