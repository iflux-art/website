'use client';

import React from 'react';
import { scrollbarStyles } from './scrollable';
import { inlineCodeStyles } from './inline-code';
import { markdownLinkStyles } from './markdown-link';
import { headingStyles } from './heading';

/**
 * 样式管理器组件
 *
 * 用于集中管理所有从 globals.css 中提取出来的样式
 * 这些样式可以通过组件直接使用，也可以通过全局样式表引用
 */
export function StyleManager() {
  return (
    <style jsx global>{`
      /* 滚动条样式 */
      ${scrollbarStyles}

      /* 内联代码样式 */
      ${inlineCodeStyles}

      /* 超链接样式 */
      ${markdownLinkStyles}

      /* 标题样式 */
      ${headingStyles}
    `}</style>
  );
}

/**
 * 获取所有组件样式
 *
 * 用于在服务端渲染时引入样式
 *
 * @returns 所有组件样式的字符串
 */
export function getAllComponentStyles(): string {
  return `
    /* 滚动条样式 */
    ${scrollbarStyles}

    /* 内联代码样式 */
    ${inlineCodeStyles}

    /* 超链接样式 */
    ${markdownLinkStyles}

    /* 标题样式 */
    ${headingStyles}
  `;
}
