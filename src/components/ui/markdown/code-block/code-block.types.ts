/**
 * code-block 组件类型定义
 */

import React from "react";

export interface CodeBlockProps {
  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 代码块内容
   */
  children: React.ReactNode;

  /**
   * 代码语言
   */
  language?: string;

  /**
   * 是否显示行号
   * @default true
   */
  showLineNumbers?: boolean;
}

export type CodeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  children: React.ReactNode;
}
