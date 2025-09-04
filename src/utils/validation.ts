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
