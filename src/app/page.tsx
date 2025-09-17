import type { Metadata } from "next";
import { FeaturedLinks } from "@/features/home/components/featured-links";
import { HeroSection } from "@/features/home/components/hero-section";
import { HOME_CONFIG } from "@/features/home/config";

// 页面元数据
export const metadata: Metadata = {
  title: HOME_CONFIG.seo.title,
  description: HOME_CONFIG.seo.description,
  openGraph: {
    title: HOME_CONFIG.seo.title,
    description: HOME_CONFIG.seo.description,
    type: HOME_CONFIG.seo.type,
    url: "https://iflux.art",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: HOME_CONFIG.seo.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_CONFIG.seo.title,
    description: HOME_CONFIG.seo.description,
    images: ["/images/og-image.png"],
  },
};

export default function Home() {
  return (
    <>
      {/* Hero区域 */}
      <HeroSection />

      {/* 特色链接 */}
      <FeaturedLinks />
    </>
  );
}
