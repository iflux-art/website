'use client';

import { MDXRenderer } from '@/components/mdx';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface DocsContentProps {
  content: MDXRemoteSerializeResult;
}

export function DocsContent({ content }: DocsContentProps) {
  return <MDXRenderer content={content} />;
}
