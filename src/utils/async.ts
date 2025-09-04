/**
 * 异步操作工具函数
 * 提供统一的异步操作处理，包括错误处理和加载状态管理
 */

import type { UseAsyncOptions } from "@/types";
import { logError, handleContentError, classifyError } from "@/lib/error";

/**
 * 异步操作执行器
 * 统一处理异步操作的加载状态、错误处理等
 */
export async function executeAsyncOperation<T>(
  operation: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
): Promise<T | null> {
  const { setLoading, setError, onSuccess, onError, contentType, contentId, validator } = options;

  try {
    // 设置加载状态
    if (setLoading) {
      setLoading(true);
    }

    // 清除之前的错误
    if (setError) {
      setError(null);
    }

    // 执行操作
    const result = await operation();

    // 验证结果（如果提供了验证器）
    if (validator && !validator(result)) {
      throw new Error("数据验证失败");
    }

    // 成功回调
    if (onSuccess) {
      onSuccess(result);
    }

    return result;
  } catch (error) {
    // 统一错误处理
    let errorMessage = "操作失败";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    // 使用专门的错误处理工具
    if (contentType) {
      const errorInfo = handleContentError(error, contentType, contentId);
      errorMessage = errorInfo.message;
    } else {
      const errorInfo = {
        type: classifyError(error) as
          | "ContentNotFound"
          | "NetworkError"
          | "ValidationError"
          | "UnknownError",
        message: errorMessage,
        originalError: error,
        timestamp: new Date(),
      };
      logError(errorInfo);
    }

    // 错误回调
    if (onError) {
      onError(error);
    }

    // 设置错误状态
    if (setError) {
      setError(errorMessage);
    }

    return null;
  } finally {
    // 清除加载状态
    if (setLoading) {
      setLoading(false);
    }
  }
}

/**
 * 创建带重试机制的异步操作
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
  options: UseAsyncOptions<T> = {}
): Promise<T | null> {
  let lastError: unknown;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const result = await executeAsyncOperation(operation, options);
      if (result !== null) {
        return result;
      }
    } catch (error) {
      lastError = error;

      // 如果不是最后一次重试，等待后继续
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * 2 ** i));
      }
    }
  }

  // 所有重试都失败了，抛出最后一个错误
  if (lastError) {
    throw lastError;
  }

  return null;
}
