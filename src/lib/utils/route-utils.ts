import { ContentType } from "@/components/common/content-display";
import { CONTENT_BASE_ROUTES } from "@/config/layout";

/**
 * 构建标签链接
 * @param tag 标签名
 * @param contentType 内容类型
 * @returns 完整的标签链接URL
 */
export function buildTagLink(tag: string, contentType: ContentType): string {
  const base = CONTENT_BASE_ROUTES[contentType];
  return `${base}?tag=${encodeURIComponent(tag)}`;
}

/**
 * 构建分类链接
 * @param category 分类名
 * @param contentType 内容类型
 * @returns 完整的分类链接URL
 */
export function buildCategoryLink(
  category: string,
  contentType: ContentType,
): string {
  const base = CONTENT_BASE_ROUTES[contentType];
  return `${base}?category=${encodeURIComponent(category)}`;
}

/**
 * 构建滚动到指定元素的函数
 * @param elementId 目标元素ID
 * @param offset 偏移量
 */
export function scrollToElement(elementId: string, offset: number): void {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // 更新 URL 中的锚点，但不触发滚动
    history.pushState(null, "", `#${elementId}`);
  }
}
