/**
 * mdx-typography 组件类型定义
 */

import React from "react";

export interface TypographyProps {
  className?: string;
  children: React.ReactNode;
}

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode;
  id?: string;
};
