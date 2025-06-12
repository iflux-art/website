'use client';

import React, { useEffect } from 'react';

/**
 * 字体加载器组件属性
 */
export interface FontLoaderProps {
  /**
   * 子元素
   */
  children?: React.ReactNode;
}

/**
 * 字体加载器组件
 * 
 * 用于加载系统字体，避免依赖外部字体服务
 * 特别是在中国网络环境下，Google 字体服务可能无法正常访问
 * 
 * @example
 * ```tsx
 * <FontLoader>
 *   <App />
 * </FontLoader>
 * ```
 */
export function FontLoader({ children }: FontLoaderProps) {
  useEffect(() => {
    // 添加系统字体样式
    const addSystemFontStyles = () => {
      // 检查是否已经添加了字体样式
      if (document.getElementById('system-font-styles')) {
        return;
      }
      
      // 创建样式元素
      const styleElement = document.createElement('style');
      styleElement.id = 'system-font-styles';
      styleElement.textContent = `
        :root {
          --font-geist-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          --font-geist-mono: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          --font-chinese: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
        }
        
        body {
          font-family: var(--font-geist-sans);
        }
        
        code, pre, kbd, samp {
          font-family: var(--font-geist-mono);
        }
        
        /* 中文内容 */
        :lang(zh), :lang(zh-CN), :lang(zh-Hans) {
          font-family: var(--font-chinese);
        }
      `;
      
      // 添加到 head 中
      document.head.appendChild(styleElement);
    };
    
    // 添加系统字体样式
    addSystemFontStyles();
    
    // 清理函数
    return () => {
      // 移除系统字体样式
      const styleElement = document.getElementById('system-font-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);
  
  return <>{children}</>;
}
