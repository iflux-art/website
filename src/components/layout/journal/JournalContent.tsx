'use client';

import { MDXRenderer } from '@/components/mdx';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface JournalContentProps {
  content: MDXRemoteSerializeResult;
}

export function JournalContent({ content }: JournalContentProps) {
  return <MDXRenderer content={content} />;
}
