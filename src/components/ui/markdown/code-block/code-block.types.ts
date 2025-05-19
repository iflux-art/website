/**
 * code-block 组件类型定义
 */

import React from "react";

export interface CodeBlockProps {
  className?: string;
  children: React.ReactNode;
  language?: string;
  filename?: string;
}

export type CodeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  'data-filename'?: string;
  children: React.ReactNode;
}
