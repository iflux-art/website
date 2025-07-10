// layout-journal-types.ts
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

export interface JournalContentProps {
  content: MDXRemoteSerializeResult;
}
