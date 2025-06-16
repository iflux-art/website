import { useState, useCallback } from 'react';
import type { ProcessingState } from '@/types/base';

interface UseMDXContentOptions {
  initialContent?: string;
  onError?: (error: Error) => void;
}

export function useMDXContent(options: UseMDXContentOptions = {}) {
  const { initialContent = '', onError } = options;

  const [content, setContent] = useState(initialContent);
  const [state, setState] = useState<ProcessingState>({
    isProcessing: false,
    error: null,
    processedCount: 0,
    totalCount: 0,
    remainingTasks: 0,
    failedTasks: 0,
    averageProcessingTime: 0,
  });

  const updateContent = useCallback(
    async (newContent: string) => {
      setState((prev: ProcessingState) => ({ ...prev, isProcessing: true }));

      try {
        setContent(newContent);
        setState((prev: ProcessingState) => ({
          ...prev,
          isProcessing: false,
          processedCount: prev.processedCount + 1,
          error: null,
        }));
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setState((prev: ProcessingState) => ({
          ...prev,
          isProcessing: false,
          error: err,
          failedTasks: prev.failedTasks + 1,
        }));
        onError?.(err);
      }
    },
    [onError]
  );

  return {
    content,
    state,
    updateContent,
  };
}

export default useMDXContent;
