import Link from "next/link";

/**
 * 文档错误类型
 */
export type DocErrorType = "not-found" | "building" | "redirect-loop" | "content-error";

interface DocErrorHandlerProps {
  errorType: DocErrorType;
  slug?: string[];
  error?: Error;
  className?: string;
}

/**
 * 文档错误处理组件
 * 统一处理文档页面的各种错误状态
 */
export const DocErrorHandler = ({
  errorType,
  slug,
  error,
  className = "",
}: DocErrorHandlerProps) => {
  const requestedPath = slug ? `/docs/${slug.join("/")}` : "/docs";

  // 记录错误信息用于调试
  if (error) {
    console.error(`Doc error at path: ${requestedPath}`, error);
  }

  const renderErrorContent = () => {
    switch (errorType) {
      case "building":
        return (
          <>
            <h1 className="mb-4 text-3xl font-bold">文档建设中</h1>
            <p className="mb-6 text-lg text-muted-foreground">该文档页面正在编写中，敬请期待！</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>请求路径: {requestedPath}</p>
              <p>我们正在努力完善文档内容</p>
            </div>
          </>
        );

      case "redirect-loop":
        return (
          <>
            <h1 className="mb-4 text-3xl font-bold">页面重定向错误</h1>
            <p className="mb-6 text-lg text-muted-foreground">
              检测到页面重定向循环，请联系管理员处理。
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>错误路径: {requestedPath}</p>
              <p>错误类型: 重定向循环</p>
            </div>
          </>
        );

      case "content-error":
        return (
          <>
            <h1 className="mb-4 text-3xl font-bold">内容加载失败</h1>
            <p className="mb-6 text-lg text-muted-foreground">
              文档内容加载时发生错误，请稍后重试。
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>请求路径: {requestedPath}</p>
              {error && <p>错误信息: {error.message}</p>}
            </div>
          </>
        );

      default:
        return (
          <>
            <h1 className="mb-4 text-3xl font-bold">页面未找到</h1>
            <p className="mb-6 text-lg text-muted-foreground">抱歉，您访问的文档页面不存在。</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>请求路径: {requestedPath}</p>
              <p>请检查链接是否正确，或从文档首页重新导航</p>
            </div>
          </>
        );
    }
  };

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center ${className}`}
    >
      {renderErrorContent()}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/docs"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          返回文档首页
        </Link>

        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          返回首页
        </Link>
      </div>

      {error && (
        <details className="mt-6 max-w-2xl">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            查看详细错误信息
          </summary>
          <pre className="mt-2 overflow-auto rounded border bg-muted p-4 text-left text-xs">
            {error.stack || error.message}
          </pre>
        </details>
      )}
    </div>
  );
};
