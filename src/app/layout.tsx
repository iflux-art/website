import "./globals.css";
import { MainNavbar } from "@/components/layout/navbar/main-navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";
import { ErrorBoundary } from "@/components/providers/error-boundary";
import { GlobalErrorHandler } from "@/components/providers/error-boundary";

/**
 * 导入集中管理的元数据配置
 * Next.js要求这些配置必须从layout.tsx中导出，这是一个约定
 * 1. 先从配置文件导入 - 便于集中管理和复用
 * 2. 然后再导出 - 满足Next.js的约定要求
 */
import { metadata, viewport, splashScreens } from "@/config/metadata";

// 导出元数据配置 - Next.js会在构建时处理这些导出
export { metadata, viewport };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      // 禁用hydration warning提示 - next-themes要求
      suppressHydrationWarning
    >
      <head>
        {/* 
          iOS启动屏配置
          动态生成不同设备尺寸的启动图配置
        */}
        {splashScreens.map(({ href, media }, index) => (
          <link
            key={index}
            rel="apple-touch-startup-image"
            href={href}
            media={media}
          />
        ))}
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <GlobalErrorHandler />
            {/* 页面主体布局容器 */}
            <div className="flex min-h-screen flex-col">
              <ServiceWorkerProvider />
              <MainNavbar className="flex-shrink-0" />
              {/* 主内容区域 - 自动填充剩余空间 */}
              <main className="flex-auto">{children}</main>
              <Footer />
            </div>
            {/* 性能分析工具 */}
            <Analytics />
            <SpeedInsights />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
