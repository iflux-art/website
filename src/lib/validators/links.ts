import { LinksFormData, LinksItem } from "@/types/links-types";

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
      category: category as (typeof validCategories)[number],
      tags: Array.isArray((formData as any).tags) ? (formData as any).tags : [],
      featured: Boolean((formData as any).featured),
      icon: (formData as any).icon || "",
      iconType: (formData as any).iconType || "text",
    },
  };
}

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
