import "./globals.css";
import { MainNavbar } from "@/components/navbar/main-navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import React from "react";

/**
 * 导入集中管理的元数据配置
 * Next.js要求这些配置必须从layout.tsx中导出，这是一个约定
 * 1. 先从配置文件导入 - 便于集中管理和复用
 * 2. 然后再导出 - 满足Next.js的约定要求
 */
import { generateMetadata, generateViewport } from "@/config/metadata";

// 导出元数据配置 - Next.js会在构建时处理这些导出
export const metadata = generateMetadata();
export const viewport = generateViewport();

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
      <head></head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 页面主体布局容器 */}
          <div className="flex min-h-screen flex-col">
            <MainNavbar className="flex-shrink-0" />
            {/* 主内容区域 - 自动填充剩余空间 */}
            <main className="flex-auto">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
