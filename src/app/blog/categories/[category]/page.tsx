import { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/config/metadata";

interface BlogCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogCategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  return createMetadata({
    title: `${decodeURIComponent(category)} - 文章分类`,
    description: `浏览 ${decodeURIComponent(category)} 分类下的所有文章`,
  });
}

export default async function BlogCategoryPage({
  params,
}: BlogCategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{decodedCategory}</h1>
      <p className="text-muted-foreground">
        {decodedCategory} 分类页面正在开发中...
      </p>
    </div>
  );
}
