"use client";

import { useCallback } from "react";

export interface ModalError {
  type: "network" | "filter" | "data" | "timeout" | "unknown";
  message: string;
  details?: string;
  retryable: boolean;
}

interface UseModalErrorHandlerReturn {
  createError: (
    type: ModalError["type"],
    message: string,
    details?: string,
  ) => ModalError;
  getErrorMessage: (error: ModalError) => string;
  getRetryMessage: (error: ModalError) => string;
  isRetryable: (error: ModalError) => boolean;
}

/**
 * 模态对话框错误处理 Hook
 *
 * 功能特性：
 * - 统一的错误类型定义和处理
 * - 用户友好的错误信息生成
 * - 错误重试机制支持
 * - 本地化错误消息
 */
export function useModalErrorHandler(): UseModalErrorHandlerReturn {
  const createError = useCallback(
    (
      type: ModalError["type"],
      message: string,
      details?: string,
    ): ModalError => {
      return {
        type,
        message,
        details,
        retryable: type === "network" || type === "timeout",
      };
    },
    [],
  );

  const getErrorMessage = useCallback((error: ModalError): string => {
    const baseMessages = {
      network: "网络连接失败，请检查网络后重试",
      filter: "筛选文章时出现错误",
      data: "数据加载失败",
      timeout: "加载超时，请重试",
      unknown: "发生未知错误",
    };

    const baseMessage = baseMessages[error.type] || baseMessages.unknown;

    if (error.message && error.message !== baseMessage) {
      return `${baseMessage}: ${error.message}`;
    }

    return baseMessage;
  }, []);

  const getRetryMessage = useCallback((error: ModalError): string => {
    if (!error.retryable) {
      return "";
    }

    const retryMessages = {
      network: "点击重试重新加载",
      timeout: "点击重试重新加载",
      filter: "点击重试重新筛选",
      data: "点击重试重新加载",
      unknown: "点击重试",
    };

    return retryMessages[error.type] || retryMessages.unknown;
  }, []);

  const isRetryable = useCallback((error: ModalError): boolean => {
    return error.retryable;
  }, []);

  return {
    createError,
    getErrorMessage,
    getRetryMessage,
    isRetryable,
  };
}
