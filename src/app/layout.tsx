import type { Metadata } from 'next';
import './globals.css';
import { MainNavbar } from '@/components/layout/navbar/MainNavbar';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { generateMetadata, generateViewport } from '@/lib/metadata';
import '@algolia/autocomplete-theme-classic/dist/theme.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { PWA_CONFIG, MOBILE_CONFIG, IOS_CONFIG, WINDOWS_CONFIG, ICONS_CONFIG } from '@/lib/constants';

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
        <meta name="viewport" content={MOBILE_CONFIG.viewport} />

        {/* 基础配置 */}
        <link rel="manifest" href={PWA_CONFIG.manifestPath} />
        <meta name="application-name" content={PWA_CONFIG.applicationName} />
        <meta name="theme-color" content={PWA_CONFIG.themeColor} />

        {/* 移动设备优化 */}
        <meta name="format-detection" content={MOBILE_CONFIG.formatDetection} />
        <meta name="msapplication-tap-highlight" content={MOBILE_CONFIG.msapplicationTapHighlight} />
        <meta name="mobile-web-app-capable" content={PWA_CONFIG.mobileWebAppCapable} />

        {/* iOS 设备配置 */}
        <meta name="apple-mobile-web-app-capable" content={IOS_CONFIG.mobileWebAppCapable} />
        <meta name="apple-mobile-web-app-status-bar-style" content={IOS_CONFIG.statusBarStyle} />
        <meta name="apple-mobile-web-app-title" content={IOS_CONFIG.appTitle} />
        <link rel="apple-touch-icon" sizes="180x180" href={IOS_CONFIG.icons.touchIcon} />
        {IOS_CONFIG.splashScreens.map((screen, index) => (
          <link
            key={index}
            rel="apple-touch-startup-image"
            href={screen.href}
            media={screen.media}
          />
        ))}

        {/* Windows 设备配置 */}
        <meta name="msapplication-TileColor" content={WINDOWS_CONFIG.msapplicationTileColor} />
        <meta name="msapplication-TileImage" content={WINDOWS_CONFIG.msapplicationTileImage} />

        {/* 图标 */}
        <link rel="icon" type="image/png" sizes="32x32" href={ICONS_CONFIG.favicon32} />
        <link rel="icon" type="image/png" sizes="16x16" href={ICONS_CONFIG.favicon16} />
        <link rel="shortcut icon" href={ICONS_CONFIG.favicon} />
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
            <MainNavbar className="flex-shrink-0" />
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