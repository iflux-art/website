import "./globals.css";
import { Footer } from "@/components/layout";
import { InitClient } from "@/components/layout/init-client";
import { MainNavbar } from "@/features/navbar/components/main-navbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { RoutePrefetcher } from "@/components/route-prefetcher";
import React from "react";

/**
 * 导入集中管理的元数据配置
 * Next.js要求这些配置必须从layout.tsx中导出，这是一个约定
 * 1. 先从配置文件导入 - 便于集中管理和复用
 * 2. 然后再导出 - 满足Next.js的约定要求
 */
import { generateMetadata, generateViewport } from "@/lib/metadata";

// 导出元数据配置 - Next.js会在构建时处理这些导出
export const metadata = generateMetadata();
export const viewport = generateViewport();

// 定义需要预取的关键路由
const KEY_ROUTES = ["/", "/blog", "/docs", "/about", "/friends"];

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html
    lang="zh-CN"
    // 禁用hydration warning提示 - next-themes要求
    suppressHydrationWarning
  >
    <head />
    <body>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {/* 页面主体布局容器 */}
        <div className="flex flex-col">
          <MainNavbar className="flex-shrink-0" />
          {/* 客户端初始化组件 */}
          <InitClient />
          {/* 路由预取器 */}
          <RoutePrefetcher routes={KEY_ROUTES} strategy="idle" />
          {/* 主内容区域 */}
          <main>{children}</main>
          <Footer />
        </div>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
