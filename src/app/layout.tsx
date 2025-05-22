import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from 'next-themes';
import { SITE_METADATA } from '@/lib/constants';
import { ThemeTransition } from '@/components/layout/transitions/theme-transition';
import { PageTransitionWrapper } from '@/components/ui/page-transition-wrapper';
import { StyleManager } from '@/components/ui/style-manager';
import React from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'iFluxArt · 斐流艺创',
  description: '斐启智境 · 流韵新生',
  authors: [{ name: SITE_METADATA.author }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans" suppressHydrationWarning>
      <head>
        {/* 添加 mermaid 脚本，用于流程图渲染 */}
        <script async src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="iflux-theme-preference"
        >
          <ThemeTransition>
            <StyleManager />
            <div className="flex flex-col min-h-screen">
              <Navbar className="flex-shrink-0" />
              <div className="flex-1 flex-grow overflow-auto">
                <PageTransitionWrapper>
                  <main className="flex-1 flex-grow">{children}</main>
                </PageTransitionWrapper>
              </div>
              <Footer />
            </div>
          </ThemeTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
