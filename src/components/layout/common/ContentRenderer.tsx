import { MDXRenderer } from "@/components/mdx/mdx-renderer";
import type { ContentRendererProps } from "@/types/common-component-types";

export function ContentRenderer({
  content,
  frontmatter: _frontmatter,
}: ContentRendererProps) {
  return <MDXRenderer content={content} />;
}
