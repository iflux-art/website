/**
 * 图片格式转换工具
 * 
 * 用于将图片转换为 WebP 和 AVIF 格式
 */

/**
 * 图片格式
 */
export type ImageFormat = 'webp' | 'avif' | 'jpeg' | 'png' | 'gif';

/**
 * 图片转换选项
 */
export interface ImageConversionOptions {
  /**
   * 目标格式
   */
  format: ImageFormat;

  /**
   * 图片质量
   * @default 80
   */
  quality?: number;

  /**
   * 图片宽度
   */
  width?: number;

  /**
   * 图片高度
   */
  height?: number;

  /**
   * 是否保持宽高比
   * @default true
   */
  maintainAspectRatio?: boolean;
}

/**
 * 获取图片的 URL 参数
 * 
 * @param options 图片转换选项
 * @returns URL 参数字符串
 */
export function getImageUrlParams(options: ImageConversionOptions): string {
  const params = new URLSearchParams();
  
  // 添加格式
  params.append('format', options.format);
  
  // 添加质量
  if (options.quality !== undefined) {
    params.append('quality', options.quality.toString());
  }
  
  // 添加宽度
  if (options.width !== undefined) {
    params.append('width', options.width.toString());
  }
  
  // 添加高度
  if (options.height !== undefined) {
    params.append('height', options.height.toString());
  }
  
  // 添加是否保持宽高比
  if (options.maintainAspectRatio !== undefined) {
    params.append('maintainAspectRatio', options.maintainAspectRatio.toString());
  }
  
  return params.toString();
}

/**
 * 获取图片的 srcset
 * 
 * @param src 图片源
 * @param format 图片格式
 * @param widths 图片宽度列表
 * @param quality 图片质量
 * @returns srcset 字符串
 */
export function getImageSrcSet(
  src: string,
  format: ImageFormat,
  widths: number[],
  quality: number = 80
): string {
  return widths
    .map(width => {
      const url = `${src}?${getImageUrlParams({
        format,
        quality,
        width,
      })} ${width}w`;
      
      return url;
    })
    .join(', ');
}

/**
 * 获取图片的 sizes 属性
 * 
 * @param breakpoints 断点配置
 * @returns sizes 字符串
 */
export function getImageSizes(breakpoints: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
  large?: number;
} = {}): string {
  const {
    mobile = 640,
    tablet = 1024,
    desktop = 1920,
    large = 2560,
  } = breakpoints;
  
  return `
    (max-width: ${mobile}px) 100vw,
    (max-width: ${tablet}px) 50vw,
    (max-width: ${desktop}px) 33vw,
    (max-width: ${large}px) 25vw,
    20vw
  `;
}

/**
 * 检测浏览器是否支持指定的图片格式
 * 
 * @param format 图片格式
 * @returns 是否支持
 */
export function isBrowserSupported(format: ImageFormat): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const canvas = document.createElement('canvas');
  
  if (!canvas.getContext) {
    return false;
  }
  
  switch (format) {
    case 'webp':
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    case 'avif':
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    case 'jpeg':
    case 'png':
    case 'gif':
      return true;
    default:
      return false;
  }
}

/**
 * 获取浏览器支持的最佳图片格式
 * 
 * @returns 最佳图片格式
 */
export function getBestSupportedFormat(): ImageFormat {
  if (isBrowserSupported('avif')) {
    return 'avif';
  }
  
  if (isBrowserSupported('webp')) {
    return 'webp';
  }
  
  return 'jpeg';
}

/**
 * 获取图片的 URL
 * 
 * @param src 图片源
 * @param options 图片转换选项
 * @returns 图片 URL
 */
export function getImageUrl(src: string, options: ImageConversionOptions): string {
  const params = getImageUrlParams(options);
  
  return `${src}?${params}`;
}
