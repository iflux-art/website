import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "next-themes";
import { SITE_METADATA } from "@/lib/constants";
import { PageTransition } from "@/components/layout/transitions/page-transition";
import { ThemeTransition } from "@/components/layout/transitions/theme-transition";
// 确保导入 React
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iFluxArt · 斐流艺创",
  description: "斐启智境 · 流韵新生",
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
            <Navbar />
            <main className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
          </ThemeTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
