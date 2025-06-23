'use client';

import { MDXRenderer } from '@/components/mdx';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface BlogContentProps {
  content: MDXRemoteSerializeResult;
}

export function BlogContent({ content }: BlogContentProps) {
  return <MDXRenderer content={content} />;
}
