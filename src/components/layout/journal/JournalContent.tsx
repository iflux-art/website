"use client";

import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

interface JournalContentProps {
  content: MDXRemoteSerializeResult;
}

export function JournalContent({ content }: JournalContentProps) {
  return <MDXRemote {...content} />;
}
