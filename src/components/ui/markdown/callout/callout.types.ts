/**
 * callout 组件类型定义
 */

import React from "react";

export interface CalloutProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'success' | 'error' | 'tip';
  title?: string;
  className?: string;
}
