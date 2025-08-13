import { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/config/metadata";

interface BlogTagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogTagPageProps): Promise<Metadata> {
  const { tag } = await params;

  return createMetadata({
    title: `${decodeURIComponent(tag)} - 博客标签`,
    description: `浏览标签为 ${decodeURIComponent(tag)} 的所有博客文章`,
  });
}

export default async function BlogTagPage({ params }: BlogTagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">#{decodedTag}</h1>
      <p className="text-muted-foreground">
        标签 #{decodedTag} 页面正在开发中...
      </p>
    </div>
  );
}
