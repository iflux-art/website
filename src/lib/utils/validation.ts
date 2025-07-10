/**
 * 简单的数据验证工具函数
 * 替代 Zod 验证
 */

/**
 * 验证字符串不为空
 */
export function validateString(value: unknown, fieldName: string): string {
  if (!value || typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} 不能为空`);
  }
  return value.trim();
}

/**
 * 验证数字
 */
export function validateNumber(
  value: unknown,
  fieldName: string,
  min?: number,
  max?: number,
): number {
  if (typeof value !== "number" || isNaN(value)) {
    throw new Error(`${fieldName} 必须是数字`);
  }
  if (min !== undefined && value < min) {
    throw new Error(`${fieldName} 不能小于 ${min}`);
  }
  if (max !== undefined && value > max) {
    throw new Error(`${fieldName} 不能大于 ${max}`);
  }
  return value;
}

/**
 * 验证布尔值
 */
export function validateBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${fieldName} 必须是布尔值`);
  }
  return value;
}

/**
 * 验证数组
 */
export function validateArray<T>(
  value: unknown,
  fieldName: string,
  validator?: (item: unknown) => T,
): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} 必须是数组`);
  }
  if (validator) {
    return value.map((item, index) => {
      try {
        return validator(item);
      } catch (error) {
        throw new Error(
          `${fieldName}[${index}] 验证失败: ${error instanceof Error ? error.message : "未知错误"}`,
        );
      }
    });
  }
  return value as T[];
}

/**
 * 验证枚举值
 */
export function validateEnum<T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[],
): T {
  if (typeof value !== "string" || !allowedValues.includes(value as T)) {
    throw new Error(
      `${fieldName} 必须是以下值之一: ${allowedValues.join(", ")}`,
    );
  }
  return value as T;
}

/**
 * 验证可选字段
 */
export function validateOptional<T>(
  value: unknown,
  validator: (val: unknown) => T,
): T | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return validator(value);
}
