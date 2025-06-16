'use client';

import { useState, useCallback } from 'react';
import { ToolState, ToolActions } from '@/components/layout/tools/tools-types';

export function useToolState(initialState?: Partial<ToolState>): [ToolState, ToolActions] {
  const [state, setState] = useState<ToolState>({
    input: '',
    output: '',
    error: '',
    isLoading: false,
    ...initialState,
  });

  const setInput = useCallback((value: string) => {
    setState(prev => ({ ...prev, input: value, error: '' }));
  }, []);

  const setOutput = useCallback((value: string) => {
    setState(prev => ({ ...prev, output: value }));
  }, []);

  const setError = useCallback((value: string) => {
    setState(prev => ({ ...prev, error: value, output: '' }));
  }, []);

  const setLoading = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, isLoading: value }));
  }, []);

  const clearAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      input: '',
      output: '',
      error: '',
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      input: '',
      output: '',
      error: '',
      isLoading: false,
    });
  }, []);

  const actions: ToolActions = {
    setInput,
    setOutput,
    setError,
    setLoading,
    clearAll,
    reset,
  };

  return [state, actions];
}
