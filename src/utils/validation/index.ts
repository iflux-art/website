/**
 * 通用验证工具函数
 *
 * 提供项目中使用的各种验证函数，包括URL验证、必填字段验证、数据格式验证等。
 *
 * @since 2025
 */

/**
 * 验证URL格式
 * @param urlString URL字符串
 * @returns 是否为有效的URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * 标准化URL
 * @param url URL字符串
 * @returns 标准化后的URL
 */
export function normalizeUrl(url: string): string {
  // 如果没有协议，添加 https://
  if (!(url.startsWith("http://") || url.startsWith("https://"))) {
    url = `https://${url}`;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch {
    throw new Error("Invalid URL format");
  }
}

/**
 * 验证必填字段
 * @param data 数据对象
 * @param requiredFields 必填字段数组
 * @returns 缺失的字段数组
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): string[] {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    // 检查字段是否存在且不为空
    if (!data[field] || (typeof data[field] === "string" && !data[field]?.toString().trim())) {
      missingFields.push(field);
    }
  }

  return missingFields;
}

/**
 * 验证页面参数
 * @param params 页面参数对象
 * @param requiredFields 必填参数数组
 * @returns 验证结果
 */
export function validatePageParams(
  params: Record<string, unknown>,
  requiredFields: string[] = []
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(
    field => params[field] === undefined || params[field] === null || params[field] === ""
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * 安全的JSON解析
 * @param jsonString JSON字符串
 * @param defaultValue 默认值
 * @returns 解析后的对象或默认值
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * 验证字符串长度
 * @param value 字符串值
 * @param min 最小长度
 * @param max 最大长度
 * @returns 是否符合长度要求
 */
export function validateStringLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * 验证数组长度
 * @param value 数组值
 * @param min 最小长度
 * @param max 最大长度
 * @returns 是否符合长度要求
 */
export function validateArrayLength<T>(value: T[], min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * 验证是否为有效的分类ID
 * @param category 分类ID
 * @param validCategories 有效的分类ID数组
 * @returns 是否为有效的分类ID
 */
export function isValidCategory<T extends readonly string[]>(
  category: string,
  validCategories: T
): category is T[number] {
  return validCategories.includes(category as T[number]);
}
