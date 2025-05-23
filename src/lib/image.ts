/**
 * 图片处理工具函数
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

/**
 * 图片加载状态
 */
export type ImageLoadingState = 'loading' | 'loaded' | 'error';

/**
 * 使用图片预加载
 * 
 * @param src 图片源
 * @returns 图片加载状态
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * 检查图片是否存在
 * 
 * @param url 图片URL
 * @returns 图片是否存在
 */
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * 获取图片尺寸
 * 
 * @param src 图片源
 * @returns 图片尺寸 {width, height}
 */
export function getImageDimensions(src: string): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * 计算图片宽高比
 * 
 * @param width 宽度
 * @param height 高度
 * @returns 宽高比
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * 根据宽高比计算高度
 * 
 * @param width 宽度
 * @param aspectRatio 宽高比
 * @returns 高度
 */
export function calculateHeightFromAspectRatio(width: number, aspectRatio: number): number {
  return width / aspectRatio;
}

/**
 * 根据宽高比计算宽度
 * 
 * @param height 高度
 * @param aspectRatio 宽高比
 * @returns 宽度
 */
export function calculateWidthFromAspectRatio(height: number, aspectRatio: number): number {
  return height * aspectRatio;
}
