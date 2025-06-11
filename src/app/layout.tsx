import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar/navbar';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { generateMetadata, generateViewport } from '@/lib/metadata';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

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
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="iflux-theme-preference"
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar className="flex-shrink-0" />
            {/* 移除了 overflow-auto 以允许 sticky 定位正常工作 */}
            <div className="flex-1 flex-grow">
              <main className="flex-1 flex-grow">{children}</main>
            </div>
            <Footer />
          </div>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}