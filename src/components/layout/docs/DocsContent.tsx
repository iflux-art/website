import { MDXRenderer } from "@/components/mdx/mdx-renderer";
import type { DocsContentProps } from "@/types/docs-types";

export function DocsContent({ content }: DocsContentProps) {
  return <MDXRenderer content={content} />;
}
