/**
 * 纯工具函数 - DOM 和路由相关
 */

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

/**
 * 构建标签页链接
 * @param tag 标签名称
 * @returns 完整的标签页URL
 */
export function buildTagLink(tag: string): string {
  return `/blog/tags/${encodeURIComponent(tag)}`;
}

/**
 * 构建分类页链接
 * @param category 分类名称字符串或DocCategory对象
 * @returns 完整的分类页URL
 */
export function buildCategoryLink(category: string | { id: string }): string {
  const categoryId = typeof category === 'string' ? category : category.id;
  return `/docs/${encodeURIComponent(categoryId)}`;
}
