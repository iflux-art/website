"use client";

/**
 * 网址解析 React Hook
 */

import type { ParseOptions, WebsiteMetadata } from "@/features/website-parser/types";
import { useCallback, useState } from "react";

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
    async (url: string, _options?: ParseOptions): Promise<WebsiteMetadata | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // 通过API路由处理网站解析，避免CORS问题
        const searchParams = new URLSearchParams({ url });
        const response = await fetch(`/api/parse-website?${searchParams.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = (await response.json()) as {
          data?: WebsiteMetadata;
          error?: string;
        };

        if (result.data) {
          setLastResult(result.data);
          return result.data;
        } else {
          const errorMessage = result.error ?? "Failed to parse website";
          setError(errorMessage);
          setLastResult(null);
          return null;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
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
