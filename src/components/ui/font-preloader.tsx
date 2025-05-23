'use client';

import React, { useEffect } from 'react';

/**
 * 字体预加载组件属性
 */
export interface FontPreloaderProps {
  /**
   * 字体 URL 列表
   */
  fontUrls?: string[];
}

/**
 * 字体预加载组件
 *
 * 用于预加载字体，减少 CLS（累积布局偏移）
 *
 * @example
 * ```tsx
 * <FontPreloader
 *   fontUrls={[
 *     '/fonts/geist-sans-variable.woff2',
 *     '/fonts/geist-mono-variable.woff2',
 *   ]}
 * />
 * ```
 */
export function FontPreloader({ fontUrls = [] }: FontPreloaderProps) {
  useEffect(() => {
    // 默认字体 URL
    const defaultFontUrls = [
      '/fonts/geist-sans-variable.woff2',
      '/fonts/geist-mono-variable.woff2',
    ];
    
    // 合并字体 URL
    const urls = [...new Set([...defaultFontUrls, ...fontUrls])];
    
    // 预加载字体
    urls.forEach(url => {
      // 创建 link 元素
      const linkElement = document.createElement('link');
      linkElement.rel = 'preload';
      linkElement.href = url;
      linkElement.as = 'font';
      linkElement.type = 'font/woff2';
      linkElement.crossOrigin = 'anonymous';
      
      // 添加到 head 中
      document.head.appendChild(linkElement);
      
      // 创建 FontFace 对象
      const fontName = url.split('/').pop()?.split('-')[0] || 'CustomFont';
      const fontFace = new FontFace(fontName, `url(${url})`, {
        display: 'swap',
        weight: '100 900',
        style: 'normal',
      });
      
      // 加载字体
      fontFace.load().then(loadedFace => {
        // 添加到 document.fonts 中
        document.fonts.add(loadedFace);
      }).catch(error => {
        console.error(`Failed to load font: ${url}`, error);
      });
    });
  }, [fontUrls]);
  
  return null;
}
