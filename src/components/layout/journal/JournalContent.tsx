"use client";

import { MDXRemote } from "next-mdx-remote";
import type { JournalContentProps } from "@/types/layout-journal-types";

export function JournalContent({ content }: JournalContentProps) {
  return <MDXRemote {...content} />;
}
