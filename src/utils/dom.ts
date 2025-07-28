/**
 * DOM 操作和视图相关工具函数
 * 合并了原dom.ts和view-utils.ts的功能
 */

/**
 * 平滑滚动到指定元素
 * @param elementId 目标元素ID
 * @param offset 偏移量（默认为0）
 * @param updateHash 是否更新URL hash（默认为false）
 */
export function scrollToElement(
  elementId: string,
  offset: number = 0,
  updateHash: boolean = false,
): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });

  // 仅在需要时更新 URL hash
  if (updateHash) {
    history.pushState(null, "", `#${elementId}`);
  }
}
