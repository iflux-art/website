'use client';

import { useState, useCallback } from 'react';
import { ToolState, ToolActions } from '@/types';

export function useToolState(initialState?: Partial<ToolState>): [ToolState, ToolActions] {
  const [state, setState] = useState<ToolState>({
    input: '',
    output: '',
    loading: false,
    error: null,
    ...initialState,
  });

  const setInput = useCallback((value: string) => {
    setState(prev => ({ ...prev, input: value, error: null }));
  }, []);

  const setOutput = useCallback((value: string) => {
    setState(prev => ({ ...prev, output: value }));
  }, []);

  const setError = useCallback((value: string) => {
    setState(prev => ({ ...prev, error: value, output: '' }));
  }, []);

  const setLoading = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, loading: value }));
  }, []);

  const clearAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      input: '',
      output: '',
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      input: '',
      output: '',
      loading: false,
      error: null,
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
