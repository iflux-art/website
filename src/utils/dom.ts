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
  updateHash: boolean = false
): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });

  // 仅在需要时更新 URL hash
  if (updateHash) {
    history.pushState(null, '', `#${elementId}`);
  }
}

/**
 * 检测元素是否在视口中
 * @param element 要检测的元素
 * @param offset 视口偏移量（默认为0）
 * @returns 元素是否在视口中
 */
export function isElementInViewport(element: HTMLElement, offset: number = 0): boolean {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 - offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 获取元素的绝对位置
 * @param element 要获取位置的元素
 * @returns 元素的绝对位置
 */
export function getElementPosition(element: HTMLElement): { top: number; left: number } {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
  };
}
