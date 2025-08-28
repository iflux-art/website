import dynamicImport from "next/dynamic";
import type { Metadata } from "next";
import { HOME_PAGE_METADATA } from "@/config";

// 启用自动缓存策略
export const dynamic = "force-static";

// 设置60秒重新验证
export const revalidate = 60;

// 页面元数据
export const metadata: Metadata = HOME_PAGE_METADATA;

// 使用动态导入来加载客户端组件，并添加预加载策略
const HeroSection = dynamicImport(
  () => import("@/features/home/components").then(mod => mod.HeroSection),
  {
    ssr: true, // 启用服务端渲染
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    ),
  }
);

export default function Home() {
  return (
    <div className="flex h-full flex-col">
      {/* Hero区域 */}
      <HeroSection />
    </div>
  );
}
