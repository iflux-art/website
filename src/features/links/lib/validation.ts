/**
 * 链接数据验证工具
 */

import type { LinksFormData, LinksItem } from "@/features/links/types";
import { isValidCategory, validateRequiredFields } from "@/utils/validation";

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
 * 验证基本字段
 */
function validateBasicFields(formData: Record<string, unknown>): {
  success: boolean;
  error?: string;
} {
  // 验证必填字段
  const missingFields = validateRequiredFields(formData, ["title", "url"]);
  if (missingFields.length > 0) {
    return { success: false, error: `${missingFields[0]}为必填项` };
  }

  const { category } = formData;
  // 验证分类ID
  if (!category || typeof category !== "string" || !isValidCategory(category, validCategories)) {
    return { success: false, error: "无效的分类ID" };
  }

  return { success: true };
}

/**
 * 构建表单数据对象
 */
function buildFormData(formData: Record<string, unknown>): LinksFormData {
  const { title, url, category, description, tags, featured, icon, iconType } = formData;

  return {
    title: title as string,
    url: url as string,
    description: (description as string) || "",
    category: category as (typeof validCategories)[number],
    tags: Array.isArray(tags) ? (tags as string[]) : [],
    featured: Boolean(featured),
    icon: (icon as string) || "",
    iconType: (iconType ?? "text") as "image" | "text",
  };
}

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

  const typedFormData = formData as Record<string, unknown>;

  const validation = validateBasicFields(typedFormData);
  if (!validation.success) {
    return validation;
  }

  return {
    success: true,
    data: buildFormData(typedFormData),
  };
}

/**
 * 验证链接更新数据
 */
export function validateLinksUpdate(
  items: LinksItem[],
  id: string,
  updates: Partial<LinksFormData>
): { success: boolean; error?: string } {
  if (updates.url) {
    const exists = items.some(item => item.url === updates.url && item.id !== id);
    if (exists) {
      return { success: false, error: "URL already exists" };
    }
  }
  return { success: true };
}
