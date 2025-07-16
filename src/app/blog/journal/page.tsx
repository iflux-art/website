"use client";
import Link from "next/link";

import { useJournalEntries } from "../src/hooks/use-journal";
import { cn, formatDate } from "../../../../packages/src/lib/utils";
import {
  groupEntriesByYear,
  type GroupedEntries,
} from "../../../../packages/src/lib/utils/date";
import { ChevronDown } from "lucide-react";
import { Badge } from "../../../../packages/src/ui/components/shared-ui/badge";
import { JournalEntry } from "../src/types/journal-types";
import { useState, useEffect, useMemo } from "react";
// 内联 typeColors 和 typeLabels 配置
const typeColors: Record<JournalEntry["type"], string> = {
  blog: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  doc: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  note: "bg-green-500/10 text-green-700 dark:text-green-300",
  idea: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
} as const;

const typeLabels: Record<JournalEntry["type"], string> = {
  blog: "博客",
  doc: "文档",
  note: "笔记",
  idea: "想法",
} as const;

export default function JournalPage() {
  const { entries } = useJournalEntries();
  const groupedEntries: GroupedEntries = groupEntriesByYear(entries);

  const allYears = useMemo(() => {
    return entries
      .map((entry) =>
        entry.date ? new Date(entry.date).getFullYear().toString() : "未知",
      )
      .filter((year, index, array) => array.indexOf(year) === index);
  }, [entries]);

  const [expandedYears, setExpandedYears] = useState<string[]>([]);

  useEffect(() => {
    if (entries.length > 0) {
      setExpandedYears(allYears);
    }
  }, [entries.length, allYears]);

  const toggleYear = (year: string) => {
    setExpandedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div>
        {groupedEntries.map(([year, yearEntries]) => (
          <div key={year} className="mb-12">
            {/* 年份标记 */}
            <div
              className="sticky top-4 z-20 mb-8 backdrop-blur-sm"
              onClick={() => toggleYear(year)}
            >
              <div className="group flex cursor-pointer items-center gap-4 bg-background/95">
                <h2 className="text-2xl font-bold">{year}</h2>
                <div className="h-px flex-1 bg-border transition-colors group-hover:bg-primary/50" />
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-all duration-200 group-hover:text-primary",
                    expandedYears.includes(year)
                      ? "rotate-0 transform"
                      : "-rotate-90 transform",
                  )}
                />
              </div>
            </div>

            <div
              className={cn(
                "relative",
                "transition-all duration-200",
                expandedYears.includes(year) ? "block" : "hidden",
              )}
            >
              {/* 时间轴垂直线 */}
              <div className="absolute left-[12rem] h-full w-px bg-border"></div>

              {yearEntries.map((entry: JournalEntry, idx) => (
                <div
                  key={`${entry.id}-${entry.date || ""}-${idx}`}
                  className="group relative mb-8 flex items-start"
                >
                  {/* 左侧日期 */}
                  <time className="w-48 pt-0.5 pr-8 text-right text-sm text-muted-foreground">
                    {entry.date
                      ? formatDate(entry.date.toString(), "MM月dd日")
                      : "未知日期"}
                  </time>

                  {/* 中间圆点 */}
                  <div className="absolute top-[7px] left-[12rem] -translate-x-[3px]">
                    <div className="h-[6px] w-[6px] rounded-full bg-primary ring-[3px] ring-background transition-all group-hover:ring-4 group-hover:ring-primary/20"></div>
                  </div>

                  {/* 右侧内容 */}
                  <div className="flex-1 pl-8">
                    <Link
                      href={entry.url}
                      className="-m-3 block rounded-lg p-3 transition-colors hover:bg-accent/50"
                    >
                      <h3 className="text-lg leading-snug font-semibold transition-colors group-hover:text-primary">
                        {entry.title}
                      </h3>
                      {entry.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {entry.description}
                        </p>
                      )}
                      <Badge
                        variant="secondary"
                        className={`mt-2 ${typeColors[entry.type]}`}
                      >
                        {typeLabels[entry.type]}
                      </Badge>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
