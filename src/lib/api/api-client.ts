/**
 * 通用API客户端
 * 提供统一的API请求接口
 */

// API响应类型
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

// HTTP方法类型
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// 请求选项
interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
  next?: {
    revalidate?: number;
  };
}

/**
 * 通用API请求函数
 * @param url - 请求URL
 * @param options - 请求选项
 * @returns API响应
 */
export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body, cache = "force-cache", next } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache,
      next,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: undefined as unknown as T,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * GET请求
 */
export function get<T>(url: string, options: Omit<RequestOptions, "method" | "body"> = {}) {
  return apiRequest<T>(url, { ...options, method: "GET" });
}

/**
 * POST请求
 */
export function post<T>(url: string, body?: unknown, options: Omit<RequestOptions, "method"> = {}) {
  return apiRequest<T>(url, { ...options, method: "POST", body });
}

/**
 * PUT请求
 */
export function put<T>(url: string, body?: unknown, options: Omit<RequestOptions, "method"> = {}) {
  return apiRequest<T>(url, { ...options, method: "PUT", body });
}

/**
 * DELETE请求
 */
export function del<T>(url: string, options: Omit<RequestOptions, "method" | "body"> = {}) {
  return apiRequest<T>(url, { ...options, method: "DELETE" });
}

/**
 * PATCH请求
 */
export function patch<T>(
  url: string,
  body?: unknown,
  options: Omit<RequestOptions, "method"> = {}
) {
  return apiRequest<T>(url, { ...options, method: "PATCH", body });
}
