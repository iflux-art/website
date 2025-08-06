/**
 * 工具函数统一导出
 * 整合所有通用工具函数，避免重复实现
 */

// ==================== 通用辅助函数 ====================
export * from "@/utils/helpers";

// ==================== 网站解析工具 ====================
export * from "@/utils/website-parser";

// ==================== 日期格式化工具 ====================
/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param format 格式字符串，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: string | Date,
  format: string = "YYYY-MM-DD",
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

// ==================== 数据验证工具 ====================
/**
 * 验证登录请求数据
 */
export function validateLoginRequest(data: unknown): {
  username: string;
  password: string;
  rememberMe: boolean;
} {
  if (typeof data !== "object" || data === null) {
    throw new Error("请求数据格式错误");
  }

  const { username, password, rememberMe } = data as Record<string, unknown>;

  if (typeof username !== "string" || username.length < 3) {
    throw new Error("用户名至少需要3个字符");
  }

  if (typeof password !== "string" || password.length < 6) {
    throw new Error("密码至少需要6个字符");
  }

  return {
    username,
    password,
    rememberMe: typeof rememberMe === "boolean" ? rememberMe : false,
  };
}

/**
 * 验证刷新令牌请求数据
 */
export function validateRefreshRequest(data: unknown): {
  refreshToken: string;
} {
  if (typeof data !== "object" || data === null) {
    throw new Error("请求数据格式错误");
  }

  const { refreshToken } = data as Record<string, unknown>;

  if (typeof refreshToken !== "string" || refreshToken.length < 10) {
    throw new Error("refresh token 至少需要10个字符");
  }

  return { refreshToken };
}

// ==================== 链接数据验证 ====================
import type { LinksFormData, LinksItem, CategoryId } from "@/types/links-types";

const validCategories = [
  "ai",
  "development",
  "design",
  "audio",
  "video",
  "office",
  "productivity",
  "operation",
  "profile",
  "friends",
] as const;

/**
 * 验证链接表单数据
 */
export function validateLinksFormData(formData: unknown): {
  success: boolean;
  error?: string;
  data?: LinksFormData;
} {
  if (!formData || typeof formData !== "object") {
    return { success: false, error: "Invalid form data" };
  }

  const { title, url, category } = formData as Record<string, unknown>;

  if (!title || typeof title !== "string") {
    return { success: false, error: "标题为必填项" };
  }

  if (!url || typeof url !== "string") {
    return { success: false, error: "URL为必填项" };
  }

  if (
    !category ||
    typeof category !== "string" ||
    !validCategories.includes(category as any)
  ) {
    return { success: false, error: "无效的分类ID" };
  }

  return {
    success: true,
    data: {
      title: title as string,
      url: url as string,
      description: (formData as any).description || "",
      category: category as CategoryId,
      tags: Array.isArray((formData as any).tags) ? (formData as any).tags : [],
      featured: Boolean((formData as any).featured),
      icon: (formData as any).icon || "",
      iconType: (formData as any).iconType || "text",
    },
  };
}

/**
 * 验证链接更新数据
 */
export function validateLinksUpdate(
  items: LinksItem[],
  id: string,
  updates: Partial<LinksFormData>,
): { success: boolean; error?: string } {
  if (updates.url) {
    const exists = items.some(
      (item) => item.url === updates.url && item.id !== id,
    );
    if (exists) {
      return { success: false, error: "URL already exists" };
    }
  }
  return { success: true };
}

// ==================== 错误处理工具 ====================
/**
 * 应用错误基类
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * 聊天相关错误
 */
export class ChatError extends AppError {
  constructor(
    message: string,
    statusCode: number = 500,
    details?: Record<string, unknown>,
  ) {
    super(message, statusCode, details);
    this.name = "ChatError";
  }
}

/**
 * 模型未找到错误
 */
export class ModelNotFoundError extends ChatError {
  constructor(modelId: string) {
    super(`Model not found: ${modelId}`, 400);
    this.name = "ModelNotFoundError";
  }
}

/**
 * API密钥未配置错误
 */
export class ApiKeyNotConfiguredError extends ChatError {
  constructor(modelName: string) {
    super(`${modelName} API key not configured`, 400);
    this.name = "ApiKeyNotConfiguredError";
  }
}

/**
 * 余额不足错误
 */
export class InsufficientBalanceError extends ChatError {
  constructor(modelName: string) {
    super(`${modelName} API insufficient balance`, 402);
    this.name = "InsufficientBalanceError";
  }
}

/**
 * API请求错误
 */
export class ApiRequestError extends ChatError {
  constructor(
    modelName: string,
    public status: number,
    public apiError?: unknown,
  ) {
    super(`${modelName} API request failed with status ${status}`, 502);
    this.name = "ApiRequestError";
  }
}

/**
 * 标准化错误响应格式
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
