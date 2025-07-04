import { MDXRenderer } from '@/components/mdx';

interface DocsContentProps {
  content: string;
}

export function DocsContent({ content }: DocsContentProps) {
  return <MDXRenderer content={content} />;
}
