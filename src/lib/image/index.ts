/**
 * 图片处理工具函数
 * @module lib/image
 */

/**
 * 处理图片加载错误
 * 
 * @param {React.SyntheticEvent<HTMLImageElement, Event>} event - 图片加载错误事件
 * @param {string} fallbackText - 图片加载失败时显示的文本，默认为空字符串
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackText: string = ''
): void {
  const target = event.currentTarget;
  
  // 隐藏图片
  target.style.display = 'none';
  
  // 如果有父元素，在父元素中显示备用文本
  if (target.parentElement) {
    // 如果没有提供备用文本，使用图片的 alt 属性或空字符串
    const text = fallbackText || target.alt || '';
    target.parentElement.innerHTML = text;
  }
}

/**
 * 获取图片的首字母作为备用文本
 * 
 * @param {string} text - 文本
 * @returns {string} 文本的首字母
 */
export function getFirstLetter(text: string): string {
  return text.charAt(0);
}
