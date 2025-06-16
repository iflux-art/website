import { useMemo } from 'react';
import { useContentData } from '@/hooks/use-content-data';
import { JournalEntry, JournalState } from '@/types/journal-types';

function sortEntriesByDate(entries: JournalEntry[] | null | undefined) {
  if (!entries || !Array.isArray(entries)) return [];
  return [...entries].sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}

export function useJournalEntries(): JournalState {
  const {
    data: entries = [],
    loading,
    error,
  } = useContentData<JournalEntry[]>({
    url: '/api/journal',
    errorMessage: '获取日志条目失败',
    cacheTime: 5 * 60 * 1000, // 5分钟缓存
  });

  const sortedEntries = useMemo(() => sortEntriesByDate(entries), [entries]);

  return {
    entries: sortedEntries,
    loading,
    error,
  };
}
