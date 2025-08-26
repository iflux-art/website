/**
 * 验证相关工具函数
 *
 * 提供数据验证相关的工具函数。
 *
 * @author 系统重构
 * @since 2024
 */

/**
 * 验证页面参数
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
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}
