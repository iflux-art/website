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
    loading: () => (
      <div className="flex items-center justify-center py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    ),
  }
);

export default function BlogPage() {
  return <BlogPageContainer />;
}
