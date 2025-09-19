import type { Metadata } from "next";
import { Footer } from "@/components";
import { SITE_METADATA } from "@/config";
import { MainNavbar } from "@/features/navbar";
import { ThemeProvider } from "@/features/theme";
import "./globals.css";

// 转换 SITE_METADATA 为 Next.js Metadata 格式
export const metadata: Metadata = {
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  keywords: [...SITE_METADATA.keywords], // 转换为可变数组
  authors: [{ name: SITE_METADATA.author }],
  creator: SITE_METADATA.author,
  publisher: SITE_METADATA.author,
  metadataBase: new URL(SITE_METADATA.url),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_METADATA.url,
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    siteName: SITE_METADATA.title,
    images: [
      {
        url: SITE_METADATA.image,
        width: 1200,
        height: 630,
        alt: SITE_METADATA.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [SITE_METADATA.image],
    creator: SITE_METADATA.twitter,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainNavbar />
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
