/**
 * pre 组件类型定义
 */

import { ComponentProps } from "react";

export interface PreProps extends ComponentProps<"pre"> {
  raw?: string;
}
