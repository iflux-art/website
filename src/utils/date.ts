import type { JournalEntry } from "@/types/journal-types";

export function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month.toString().padStart(2, "0")}月${day.toString().padStart(2, "0")}日`;
  } catch {
    return "";
  }
}

export type GroupedEntries = [string, JournalEntry[]][];

export function groupEntriesByYear(entries: JournalEntry[]): GroupedEntries {
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
