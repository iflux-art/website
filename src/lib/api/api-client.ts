/**
 * 统一API客户端
 * 提供标准化的API请求处理，包括错误处理、重试机制、缓存等
 */

import type { UseAsyncOptions } from "@/types";
import { executeAsyncOperation, executeWithRetry } from "@/utils/async";
import { handleNetworkError, logError, classifyError } from "@/lib/error";

// API配置接口
interface ApiClientConfig {
  /** 基础URL */
  baseURL?: string;
  /** 默认请求头 */
  headers?: Record<string, string>;
  /** 默认超时时间（毫秒） */
  timeout?: number;
  /** 默认重试次数 */
  retries?: number;
  /** 默认重试延迟（毫秒） */
  retryDelay?: number;
}

// 请求配置接口
interface RequestConfig<T> extends UseAsyncOptions<T> {
  /** 请求方法 */
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求体 */
  body?: unknown;
  /** 查询参数 */
  params?: Record<string, string | number | boolean>;
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 重试次数 */
  retries?: number;
  /** 重试延迟（毫秒） */
  retryDelay?: number;
}

// API错误响应接口
interface ApiErrorResponse {
  /** 错误消息 */
  message: string;
  /** 错误代码 */
  code?: string;
  /** 错误详情 */
  details?: Record<string, unknown>;
}

/**
 * API客户端类
 */
export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || "",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      timeout: config.timeout || 10000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
    };
  }

  /**
   * 构建完整URL
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    let url = this.config.baseURL ? `${this.config.baseURL}${endpoint}` : endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    return url;
  }

  /**
   * 创建请求选项
   */
  private createRequestOptions<T>(config: RequestConfig<T>): RequestInit {
    const headers = {
      ...this.config.headers,
      ...config.headers,
    };

    const options: RequestInit = {
      method: config.method || "GET",
      headers,
      signal: config.timeout ? AbortSignal.timeout(config.timeout) : undefined,
    };

    if (config.body) {
      options.body = JSON.stringify(config.body);
    }

    return options;
  }

  /**
   * 处理API响应
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // 检查响应是否成功
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode: string | undefined;

      // 尝试解析错误响应体
      try {
        const errorData: ApiErrorResponse = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.code;
      } catch {
        // 如果无法解析错误响应体，使用默认消息
      }

      // 创建详细的错误信息
      const errorInfo = {
        type: classifyError(new Error(errorMessage)) as "NetworkError" | "UnknownError",
        message: errorMessage,
        code: errorCode,
        context: {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        },
        timestamp: new Date(),
      };

      // 记录错误日志
      logError(errorInfo);

      // 抛出自定义错误
      const error = new Error(errorMessage);
      (error as Error & { code?: string; status?: number }).code = errorCode;
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }

    // 解析成功响应
    try {
      const data = await response.json();
      return data as T;
    } catch (error) {
      const parseError = new Error("Failed to parse response data");
      (parseError as Error & { originalError?: unknown }).originalError = error;
      throw parseError;
    }
  }

  /**
   * 发送请求
   */
  async request<T>(endpoint: string, config: RequestConfig<T> = {}): Promise<T | null> {
    const url = this.buildURL(endpoint, config.params);
    const options = this.createRequestOptions(config);

    const fetchOperation = async () => {
      const response = await fetch(url, options);
      return await this.handleResponse<T>(response);
    };

    // 如果配置了重试，则使用重试机制
    if (config.retries && config.retries > 0) {
      return await executeWithRetry(
        fetchOperation,
        config.retries,
        config.retryDelay || this.config.retryDelay,
        {
          setLoading: config.setLoading,
          setError: config.setError,
          onSuccess: config.onSuccess,
          onError: error => {
            // 使用统一的网络错误处理
            handleNetworkError(error, url);
            if (config.onError) {
              config.onError(error);
            }
          },
          validator: config.validator,
        }
      );
    }

    // 否则使用标准异步操作
    return await executeAsyncOperation(fetchOperation, {
      setLoading: config.setLoading,
      setError: config.setError,
      onSuccess: config.onSuccess,
      onError: error => {
        // 使用统一的网络错误处理
        handleNetworkError(error, url);
        if (config.onError) {
          config.onError(error);
        }
      },
      validator: config.validator,
    });
  }

  /**
   * GET请求
   */
  get<T>(endpoint: string, config: Omit<RequestConfig<T>, "method" | "body"> = {}) {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  /**
   * POST请求
   */
  post<T>(endpoint: string, config: Omit<RequestConfig<T>, "method"> = {}) {
    return this.request<T>(endpoint, { ...config, method: "POST" });
  }

  /**
   * PUT请求
   */
  put<T>(endpoint: string, config: Omit<RequestConfig<T>, "method"> = {}) {
    return this.request<T>(endpoint, { ...config, method: "PUT" });
  }

  /**
   * DELETE请求
   */
  delete<T>(endpoint: string, config: Omit<RequestConfig<T>, "method" | "body"> = {}) {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  /**
   * PATCH请求
   */
  patch<T>(endpoint: string, config: Omit<RequestConfig<T>, "method"> = {}) {
    return this.request<T>(endpoint, { ...config, method: "PATCH" });
  }
}

// 创建默认API客户端实例
export const apiClient = new ApiClient({
  baseURL: "/api",
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
});

// 导出便捷函数
export const { get, post, put, delete: deleteRequest, patch } = apiClient;

// 注意：友链相关类型定义在 @/features/friends/types 中
import type { FriendLink } from "@/features/friends/types";

// 定义友链申请的类型
interface FriendLinkApplication {
  name: string;
  url: string;
  description: string;
  email: string;
  category: string;
}

// 友链相关便捷函数
export const friendsApi = {
  /**
   * 获取所有友链
   */
  getFriends: () => get<FriendLink[]>("/friends"),

  /**
   * 提交友链申请
   */
  submitFriendApplication: (application: FriendLinkApplication) =>
    post<FriendLinkApplication>("/friends/apply", {
      body: application,
    }),

  /**
   * 获取友链统计数据
   */
  getFriendStats: () => get<{ total: number; pending: number }>("/friends/stats"),
};
