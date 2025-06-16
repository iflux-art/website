'use client';
import Link from 'next/link';

import { useJournalEntries } from '@/hooks/use-journal';
import { formatDate } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { JournalEntry } from '@/types/journal-types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
type GroupedEntries = [string, JournalEntry[]][];

function groupEntriesByYear(entries: JournalEntry[]): GroupedEntries {
  const groups = entries.reduce<Record<string, JournalEntry[]>>((acc, entry) => {
    const year = new Date(entry.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(entry);
    return acc;
  }, {});

  return Object.entries(groups).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));
}

// 类型标签样式映射
const typeColors: Record<JournalEntry['type'], string> = {
  blog: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  doc: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
} as const;

const typeLabels: Record<JournalEntry['type'], string> = {
  blog: '博客',
  doc: '文档',
} as const;

export default function JournalPage() {
  const { entries, loading, error } = useJournalEntries();
  const groupedEntries = groupEntriesByYear(entries);
  const [expandedYears, setExpandedYears] = useState<string[]>(() => {
    // 默认展开最新的年份
    return entries.length > 0 ? [new Date(entries[0].date).getFullYear().toString()] : [];
  });

  const toggleYear = (year: string) => {
    setExpandedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
          {groupedEntries.map(([year, yearEntries]) => (
            <div key={year} className="mb-12">
              {/* 年份标记 */}
              <div
                className="sticky top-4 z-20 mb-8 backdrop-blur-sm"
                onClick={() => toggleYear(year)}
              >
                <div className="flex items-center gap-4 cursor-pointer group bg-background/95">
                  <h2 className="text-2xl font-bold">{year}</h2>
                  <div className="flex-1 h-px bg-border group-hover:bg-primary/50 transition-colors" />
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-200',
                      expandedYears.includes(year) ? 'transform rotate-0' : 'transform -rotate-90'
                    )}
                  />
                </div>
              </div>

              <div
                className={cn(
                  'relative',
                  'transition-all duration-200',
                  expandedYears.includes(year) ? 'block' : 'hidden'
                )}
              >
                {/* 时间轴垂直线 */}
                <div className="absolute left-[12rem] w-px h-full bg-border"></div>

                {yearEntries.map((entry: JournalEntry) => (
                  <div key={entry.id} className="relative flex items-start group mb-8">
                    {/* 左侧日期 */}
                    <time className="w-48 text-sm text-muted-foreground pt-0.5 pr-8 text-right">
                      {formatDate(entry.date, 'MM月dd日')}
                    </time>

                    {/* 中间圆点 */}
                    <div className="absolute left-[12rem] -translate-x-[3px] top-[7px]">
                      <div
                        className="w-[6px] h-[6px] rounded-full bg-primary ring-[3px] ring-background 
                        group-hover:ring-4 group-hover:ring-primary/20 transition-all"
                      ></div>
                    </div>

                    {/* 右侧内容 */}
                    <div className="flex-1 pl-8">
                      <Link
                        href={entry.url}
                        className="block rounded-lg hover:bg-accent/50 transition-colors p-3 -m-3"
                      >
                        <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                          {entry.title}
                        </h3>
                        {entry.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
                        )}
                        <Badge variant="secondary" className={`mt-2 ${typeColors[entry.type]}`}>
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
      )}
    </div>
  );
}
