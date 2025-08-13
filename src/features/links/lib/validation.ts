/**
 * 链接数据验证工具
 */

import type { LinksFormData, LinksItem, CategoryId } from "../types";

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
