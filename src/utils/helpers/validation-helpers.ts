/**
 * 验证相关工具函数
 *
 * 提供数据验证相关的工具函数。
 *
 * @author 系统重构
 * @since 2024
 */

import {
  validatePageParams as validatePageParamsUtil,
  safeJsonParse as safeJsonParseUtil,
} from "@/utils/validation";

/**
 * 验证页面参数
 */
export function validatePageParams(
  params: Record<string, unknown>,
  requiredFields: string[] = []
): { isValid: boolean; missingFields: string[] } {
  return validatePageParamsUtil(params, requiredFields);
}

/**
 * 安全的JSON解析
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  return safeJsonParseUtil(jsonString, defaultValue);
}
