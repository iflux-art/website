import { MDXRenderer } from "@/components/mdx/mdx-renderer";

interface ContentRendererProps {
  content: string;
  frontmatter?: Record<string, unknown>;
}

export function ContentRenderer({
  content,
  frontmatter: _frontmatter,
}: ContentRendererProps) {
  return <MDXRenderer content={content} />;
}
