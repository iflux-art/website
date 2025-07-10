import type { JournalEntry } from "@/types/journal-types";

export const typeColors: Record<JournalEntry["type"], string> = {
  blog: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  doc: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  note: "bg-green-500/10 text-green-700 dark:text-green-300",
  idea: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
} as const;

export const typeLabels: Record<JournalEntry["type"], string> = {
  blog: "博客",
  doc: "文档",
  note: "笔记",
  idea: "想法",
} as const;
