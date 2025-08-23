'use client';

/**
 * 网址解析 React Hook
 */

import { useCallback, useState } from 'react';
import { parseWebsite as parseWebsiteMetadata } from '@/features/website-parser/lib/parser';
import type { ParseOptions, WebsiteMetadata } from '@/features/website-parser/types';

interface UseWebsiteParserReturn {
  parseWebsite: (url: string, options?: ParseOptions) => Promise<WebsiteMetadata | null>;
  isLoading: boolean;
  error: string | null;
  lastResult: WebsiteMetadata | null;
}

export function useWebsiteParser(): UseWebsiteParserReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<WebsiteMetadata | null>(null);

  const parseWebsite = useCallback(
    async (url: string, options?: ParseOptions): Promise<WebsiteMetadata | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await parseWebsiteMetadata(url, options);

        if (result.success && result.data) {
          setLastResult(result.data);
          return result.data;
        } else {
          setError(result.error ?? 'Failed to parse website');
          setLastResult(result.data ?? null);
          return result.data ?? null;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setLastResult(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    parseWebsite,
    isLoading,
    error,
    lastResult,
  };
}
