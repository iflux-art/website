import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { BLOG_PAGE_METADATA } from "@/config";

// 页面元数据
export const metadata: Metadata = BLOG_PAGE_METADATA;

// 动态导入博客页面容器组件
const BlogPageContainer = dynamic(
  () => import("@/features/blog/components/blog-page").then(mod => mod.BlogPageContainer),
  {
    ssr: true,
    // 移除自定义加载动画，使用全局的加载状态
  }
);

export default function BlogPage() {
  return <BlogPageContainer />;
}
