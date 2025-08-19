/**
 * 链接数据验证工具
 */

import type { LinksFormData, LinksItem } from '@/features/links/types';

const validCategories = [
  'ai',
  'development',
  'design',
  'audio',
  'video',
  'office',
  'productivity',
  'operation',
  'profile',
  'friends',
] as const;

/**
 * 验证链接表单数据
 */
export function validateLinksFormData(formData: unknown): {
  success: boolean;
  error?: string;
  data?: LinksFormData;
} {
  if (!formData || typeof formData !== 'object') {
    return { success: false, error: 'Invalid form data' };
  }

  const { title, url, category } = formData as Record<string, unknown>;

  if (!title || typeof title !== 'string') {
    return { success: false, error: '标题为必填项' };
  }

  if (!url || typeof url !== 'string') {
    return { success: false, error: 'URL为必填项' };
  }

  if (
    !category ||
    typeof category !== 'string' ||
    !validCategories.includes(category as (typeof validCategories)[number])
  ) {
    return { success: false, error: '无效的分类ID' };
  }

  return {
    success: true,
    data: {
      title,
      url,
      description: ((formData as Record<string, unknown>).description as string) || '',
      category: category as (typeof validCategories)[number],
      tags: Array.isArray((formData as Record<string, unknown>).tags)
        ? ((formData as Record<string, unknown>).tags as string[])
        : [],
      featured: Boolean((formData as Record<string, unknown>).featured),
      icon: ((formData as Record<string, unknown>).icon as string) || '',
      iconType: ((formData as Record<string, unknown>).iconType ?? 'text') as 'image' | 'text',
    },
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
      return { success: false, error: 'URL already exists' };
    }
  }
  return { success: true };
}
