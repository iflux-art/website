import { MDXRenderer } from "@/components/mdx/mdx-renderer";

interface DocsContentProps {
  content: string;
}

export function DocsContent({ content }: DocsContentProps) {
  return <MDXRenderer content={content} />;
}
