import { MDXRenderer } from "@/components/mdx/mdx-renderer";

interface BlogContentProps {
  content: string;
  frontmatter?: Record<string, unknown>;
}

export function BlogContent({
  content,
  frontmatter: _frontmatter,
}: BlogContentProps) {
  return <MDXRenderer content={content} />;
}
