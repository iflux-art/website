import type { JournalEntry } from "@/types/journal-types";

export type GroupedEntries = [string, JournalEntry[]][];

/**
 * 按年份分组日志条目
 * @param entries 日志条目数组
 * @returns 按年份分组的条目
 */
export function useGroupEntries(entries: JournalEntry[]): GroupedEntries {
  const groups = entries.reduce<Record<string, JournalEntry[]>>(
    (acc, entry) => {
      const year = entry.date
        ? new Date(entry.date).getFullYear().toString()
        : "未知";
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(entry);
      return acc;
    },
    {},
  );

  return Object.entries(groups).sort(
    ([yearA], [yearB]) => Number(yearB) - Number(yearA),
  );
}
