/**
 * code-group 组件类型定义
 */

import React from "react";

export interface CodeGroupProps {
  children: React.ReactNode;
  className?: string;
}

export interface CodeTabProps {
  children: React.ReactNode;
  title: string;
  language?: string;
  className?: string;
  isActive?: boolean;
}
