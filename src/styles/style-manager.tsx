'use client';

import React from 'react';
// 样式配置对象
const styleConfig = {
  scrollbar: import('./scrollable').then(m => m.scrollbarStyles),
  inlineCode: import('./inline-code').then(m => m.inlineCodeStyles),
  markdownLink: import('./markdown-link').then(m => m.markdownLinkStyles),
  heading: import('./heading').then(m => m.headingStyles),
};

// 样式块模板
const styleBlocks = {
  scrollbar: '/* 滚动条样式 */\n',
  inlineCode: '/* 内联代码样式 */\n',
  markdownLink: '/* 超链接样式 */\n',
  heading: '/* 标题样式 */\n',
};

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
      ${styleBlocks.scrollbar}${styleConfig.scrollbar}
      ${styleBlocks.inlineCode}${styleConfig.inlineCode}
      ${styleBlocks.markdownLink}${styleConfig.markdownLink}
      ${styleBlocks.heading}${styleConfig.heading}
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
    ${styleBlocks.scrollbar}${styleConfig.scrollbar}
    ${styleBlocks.inlineCode}${styleConfig.inlineCode}
    ${styleBlocks.markdownLink}${styleConfig.markdownLink}
    ${styleBlocks.heading}${styleConfig.heading}
  `;
}
