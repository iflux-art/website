import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar/navbar';
import { Footer } from '@/components/layout/footer/footer';
import { ThemeProvider } from 'next-themes';
import { SITE_METADATA } from '@/lib/constants';
import { StyleManager } from '@/components/ui/style-manager';
import React from 'react';
import { getFontClassName } from '@/lib/fonts';
import { CssOptimizer } from '@/components/ui/css-optimizer';
import { FontLoader } from '@/components/ui/font-loader';
import { ServiceWorkerUpdater } from '@/components/ui/service-worker-updater';
import { WebVitalsMonitor } from '@/components/ui/web-vitals-monitor';
import { Preloader } from '@/components/ui/preloader';
import { generateMetadata, generateViewport } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata();
export const viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 添加 mermaid 脚本，用于流程图渲染 */}
        <script async src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js" />
      </head>
      <body className={`${getFontClassName()} antialiased flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="iflux-theme-preference"
        >
          <StyleManager />
          <div className="flex flex-col min-h-screen bg-background dark:bg-[#0a0a0a]">
            <Navbar className="flex-shrink-0" />
            <div className="flex-1 flex-grow overflow-auto">
              <main className="flex-1 flex-grow">{children}</main>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
