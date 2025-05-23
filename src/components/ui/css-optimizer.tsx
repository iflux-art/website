'use client';

import React, { useEffect } from 'react';

/**
 * CSS 优化器组件属性
 */
export interface CssOptimizerProps {
  /**
   * 子元素
   */
  children?: React.ReactNode;
}

/**
 * CSS 优化器组件
 *
 * 用于优化 CSS 加载，减少 CLS（累积布局偏移）
 *
 * @example
 * ```tsx
 * <CssOptimizer>
 *   <App />
 * </CssOptimizer>
 * ```
 */
export function CssOptimizer({ children }: CssOptimizerProps) {
  useEffect(() => {
    // 延迟加载非关键 CSS
    const loadNonCriticalCSS = () => {
      // 创建 link 元素
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = '/styles/non-critical.css';
      linkElement.media = 'print';
      linkElement.onload = () => {
        // 加载完成后，将 media 设置为 all
        linkElement.media = 'all';
      };

      // 添加到 head 中
      document.head.appendChild(linkElement);
    };

    // 使用 requestIdleCallback 在浏览器空闲时加载非关键 CSS
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      window.requestIdleCallback(loadNonCriticalCSS);
    } else {
      // 如果浏览器不支持 requestIdleCallback，使用 setTimeout
      setTimeout(loadNonCriticalCSS, 1000);
    }

    // 移除未使用的 CSS
    const removeUnusedCSS = () => {
      // 获取所有样式表
      const styleSheets = Array.from(document.styleSheets);

      // 遍历样式表
      styleSheets.forEach(styleSheet => {
        try {
          // 获取所有规则
          const rules = Array.from(styleSheet.cssRules);

          // 遍历规则
          rules.forEach(rule => {
            // 如果是样式规则
            if (rule instanceof CSSStyleRule) {
              // 获取选择器
              const selector = rule.selectorText;

              // 如果选择器不是通配符、:root、html、body 等
              if (
                selector &&
                !selector.includes('*') &&
                !selector.includes(':root') &&
                !selector.includes('html') &&
                !selector.includes('body') &&
                !selector.includes(':') &&
                !selector.includes('[') &&
                !selector.includes('>')
              ) {
                try {
                  // 检查选择器是否匹配任何元素
                  if (document.querySelector(selector) === null) {
                    // 如果不匹配，删除规则
                    // 注意：这里不能直接删除规则，因为会改变索引
                    // 所以我们只是将规则的样式设置为空
                    const style = (rule as CSSStyleRule).style;
                    for (let i = style.length - 1; i >= 0; i--) {
                      const property = style[i];
                      style.setProperty(property, '');
                    }
                  }
                } catch (e) {
                  // 忽略无效的选择器
                }
              }
            }
          });
        } catch (e) {
          // 忽略跨域样式表
        }
      });
    };

    // 在页面加载完成后移除未使用的 CSS
    if (document.readyState === 'complete') {
      removeUnusedCSS();
    } else {
      window.addEventListener('load', removeUnusedCSS);
    }

    // 清理函数
    return () => {
      window.removeEventListener('load', removeUnusedCSS);
    };
  }, []);

  return <>{children}</>;
}
